import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Bot,
  Loader2,
  Mic,
  Square,
  RotateCcw,
  Play,
  Pause,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import api from "../../services/api";

// =====================================================
// CONSTANTS
// =====================================================

const TOTAL_QUESTIONS = 5;

// =====================================================
// COMPONENT
// =====================================================

const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // INTERVIEW STATE
  // =====================================================

  const [interview, setInterview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // RECORDING STATE
  // =====================================================

  const [isRecording, setIsRecording] = useState(false);

  const [audioBlob, setAudioBlob] = useState(null);

  const [audioUrl, setAudioUrl] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);

  const [recordingTime, setRecordingTime] = useState(0);

  // =====================================================
  // LAST ANSWER RESULT
  // =====================================================

  const [lastResult, setLastResult] = useState(null);

  // =====================================================
  // REFS
  // =====================================================

  const mediaRecorderRef = useRef(null);

  const mediaStreamRef = useRef(null);

  const audioChunksRef = useRef([]);

  const audioRef = useRef(null);

  const timerRef = useRef(null);

  // IMPORTANT:
  // Blob URL ko state ke saath ref mein bhi maintain karenge.
  // Isse stale audioUrl revoke hone ka issue avoid hota hai.
  const audioUrlRef = useRef("");

  // =====================================================
  // API RESPONSE HELPER
  // =====================================================

  const extractData = (response) => {
    return (
      response?.data?.data ||
      response?.data?.interview ||
      response?.data
    );
  };

  // =====================================================
  // ERROR HELPER
  // =====================================================

  const getErrorMessage = (err, fallback) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.detail ||
      err?.response?.data?.error ||
      err?.message ||
      fallback
    );
  };

  // =====================================================
  // SAFE AUDIO URL CLEANUP
  // =====================================================

  const revokeAudioUrl = () => {
    const url = audioUrlRef.current;

    if (!url) {
      return;
    }

    // Stop current audio first.
    if (audioRef.current) {
      try {
        audioRef.current.pause();

        // Remove old blob URL from audio element
        // BEFORE revoking the URL.
        audioRef.current.removeAttribute("src");

        audioRef.current.load();
      } catch (err) {
        console.warn(
          "AUDIO ELEMENT CLEANUP ERROR:",
          err
        );
      }
    }

    try {
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn(
        "BLOB URL REVOKE ERROR:",
        err
      );
    }

    audioUrlRef.current = "";
    setAudioUrl("");
    setIsPlaying(false);
  };

  // =====================================================
  // SET NEW AUDIO URL
  // =====================================================

  const setNewAudioUrl = (blob) => {
    // Remove previous URL first.
    revokeAudioUrl();

    if (!blob) {
      return;
    }

    const newUrl = URL.createObjectURL(blob);

    audioUrlRef.current = newUrl;

    setAudioUrl(newUrl);
  };

  // =====================================================
  // STOP MEDIA STREAM
  // =====================================================

  const stopMediaStream = () => {
    if (!mediaStreamRef.current) {
      return;
    }

    try {
      mediaStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    } catch (err) {
      console.warn(
        "MEDIA STREAM STOP ERROR:",
        err
      );
    }

    mediaStreamRef.current = null;
  };

  // =====================================================
  // CLEAR RECORDING STATE
  // =====================================================

  const clearRecording = () => {
    // Stop playback
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (err) {
        console.warn(
          "AUDIO RESET ERROR:",
          err
        );
      }
    }

    setIsPlaying(false);

    // Remove src before revoke
    revokeAudioUrl();

    setAudioBlob(null);

    setRecordingTime(0);

    audioChunksRef.current = [];
  };

  // =====================================================
  // LOAD INTERVIEW
  // =====================================================

  const loadInterview = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/interviews/${id}`
      );

      console.log(
        "========== LOAD INTERVIEW =========="
      );

      console.log(
        "INTERVIEW RESPONSE:",
        response.data
      );

      const data = extractData(response);

      if (!data?._id) {
        throw new Error(
          "Invalid interview response received."
        );
      }

      setInterview(data);
    } catch (err) {
      console.error(
        "INTERVIEW LOAD ERROR:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Unable to load interview"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CREATE INTERVIEW
  // =====================================================

  const createInterview = async () => {
    try {
      setCreating(true);
      setError("");

      const response = await api.post(
        "/interviews",
        {
          projectId: id,
          type: "Backend",
          difficulty: "Medium",
        }
      );

      console.log(
        "CREATE INTERVIEW RESPONSE:",
        response.data
      );

      const data = extractData(response);

      if (!data?._id) {
        throw new Error(
          "Interview creation failed."
        );
      }

      setInterview(data);
    } catch (err) {
      console.error(
        "CREATE INTERVIEW ERROR:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Unable to create interview"
        )
      );
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // START INTERVIEW
  // =====================================================

  const startInterview = async () => {
    if (!interview?._id) {
      setError(
        "Interview ID is missing."
      );

      return;
    }

    try {
      setStarting(true);
      setError("");

      const response = await api.post(
        `/interviews/${interview._id}/start`
      );

      console.log(
        "START INTERVIEW RESPONSE:",
        response.data
      );

      const data = extractData(response);

      if (!data?._id) {
        throw new Error(
          "Invalid start interview response."
        );
      }

      setInterview(data);

      // New question means fresh recording.
      clearRecording();

      setLastResult(null);
    } catch (err) {
      console.error(
        "START INTERVIEW ERROR:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Unable to start interview"
        )
      );
    } finally {
      setStarting(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (!id) {
      setError(
        "Project ID is missing."
      );

      setLoading(false);

      return;
    }

    loadInterview();
  }, [id]);

  // =====================================================
  // COMPONENT UNMOUNT CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      // Timer
      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );

        timerRef.current = null;
      }

      // Recorder
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !==
          "inactive"
      ) {
        try {
          mediaRecorderRef.current.stop();
        } catch (err) {
          console.warn(
            "RECORDER CLEANUP ERROR:",
            err
          );
        }
      }

      // Mic
      stopMediaStream();

      // Audio
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.removeAttribute(
            "src"
          );
          audioRef.current.load();
        } catch (err) {
          console.warn(
            "AUDIO UNMOUNT CLEANUP ERROR:",
            err
          );
        }
      }

      // Revoke ONLY current URL.
      const url = audioUrlRef.current;

      if (url) {
        try {
          URL.revokeObjectURL(url);
        } catch (err) {
          console.warn(
            "FINAL BLOB REVOKE ERROR:",
            err
          );
        }

        audioUrlRef.current = "";
      }
    };
  }, []);

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (seconds) => {
    const safeSeconds =
      Number(seconds) || 0;

    const mins = Math.floor(
      safeSeconds / 60
    )
      .toString()
      .padStart(2, "0");

    const secs = (
      safeSeconds % 60
    )
      .toString()
      .padStart(2, "0");

    return `${mins}:${secs}`;
  };

  // =====================================================
  // GET CURRENT QUESTION
  // =====================================================

  const getCurrentQuestion = () => {
    if (
      !interview?.questions?.length
    ) {
      return null;
    }

    return interview.questions[
      interview.questions.length - 1
    ];
  };

  // =====================================================
  // GET QUESTION NUMBER
  // =====================================================

  const getQuestionNumber = () => {
    if (
      !interview?.questions?.length
    ) {
      return 0;
    }

    return interview.questions.length;
  };

  // =====================================================
  // START RECORDING
  // =====================================================

  const startRecording = async () => {
    if (isRecording) {
      return;
    }

    try {
      setError("");

      // -------------------------------------------------
      // BROWSER SUPPORT
      // -------------------------------------------------

      if (
        !navigator.mediaDevices?.getUserMedia
      ) {
        setError(
          "Voice recording is not supported by this browser."
        );

        return;
      }

      if (!window.MediaRecorder) {
        setError(
          "MediaRecorder is not supported by this browser."
        );

        return;
      }

      // -------------------------------------------------
      // CLEAR PREVIOUS RECORDING
      // -------------------------------------------------

      clearRecording();

      // -------------------------------------------------
      // GET MICROPHONE
      // -------------------------------------------------

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      mediaStreamRef.current =
        stream;

      audioChunksRef.current = [];

      // -------------------------------------------------
      // CREATE MEDIA RECORDER
      // -------------------------------------------------

      let recorder;

      const supportedMimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
      ];

      const supportedMimeType =
        supportedMimeTypes.find(
          (type) =>
            MediaRecorder.isTypeSupported?.(
              type
            )
        );

      try {
        recorder = supportedMimeType
          ? new MediaRecorder(
              stream,
              {
                mimeType:
                  supportedMimeType,
              }
            )
          : new MediaRecorder(
              stream
            );
      } catch (err) {
        console.warn(
          "MIME TYPE RECORDER FALLBACK:",
          err
        );

        recorder =
          new MediaRecorder(stream);
      }

      mediaRecorderRef.current =
        recorder;

      // -------------------------------------------------
      // AUDIO DATA
      // -------------------------------------------------

      recorder.ondataavailable = (
        event
      ) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          audioChunksRef.current.push(
            event.data
          );
        }
      };

      // -------------------------------------------------
      // RECORDING STOP
      // -------------------------------------------------

      recorder.onstop = () => {
        const chunks =
          audioChunksRef.current;

        if (!chunks.length) {
          setError(
            "No audio was recorded. Please try again."
          );

          stopMediaStream();

          return;
        }

        const blob = new Blob(
          chunks,
          {
            type:
              recorder.mimeType ||
              "audio/webm",
          }
        );

        if (!blob.size) {
          setError(
            "Recorded audio is empty. Please try again."
          );

          stopMediaStream();

          return;
        }

        console.log(
          "========== RECORDING READY =========="
        );

        console.log(
          "Audio Type:",
          blob.type
        );

        console.log(
          "Audio Size:",
          blob.size
        );

        setAudioBlob(blob);

        // IMPORTANT:
        // Only create URL here.
        // No immediate revoke.
        setNewAudioUrl(blob);

        // Stop mic
        stopMediaStream();

        mediaRecorderRef.current =
          null;

        audioChunksRef.current = [];
      };

      // -------------------------------------------------
      // RECORDER ERROR
      // -------------------------------------------------

      recorder.onerror = (event) => {
        console.error(
          "MEDIA RECORDER ERROR:",
          event
        );

        setError(
          "Recording failed. Please try again."
        );

        setIsRecording(false);

        stopMediaStream();

        if (timerRef.current) {
          clearInterval(
            timerRef.current
          );

          timerRef.current = null;
        }
      };

      // -------------------------------------------------
      // START
      // -------------------------------------------------

      recorder.start(250);

      setIsRecording(true);

      setRecordingTime(0);

      // -------------------------------------------------
      // TIMER
      // -------------------------------------------------

      timerRef.current =
        setInterval(() => {
          setRecordingTime(
            (previous) =>
              previous + 1
          );
        }, 1000);

      console.log(
        "========== RECORDING STARTED =========="
      );
    } catch (err) {
      console.error(
        "RECORDING ERROR:",
        err
      );

      stopMediaStream();

      if (timerRef.current) {
        clearInterval(
          timerRef.current
        );

        timerRef.current = null;
      }

      setIsRecording(false);

      if (
        err?.name ===
        "NotAllowedError"
      ) {
        setError(
          "Microphone permission denied. Please allow microphone access."
        );
      } else if (
        err?.name ===
        "NotFoundError"
      ) {
        setError(
          "No microphone was found."
        );
      } else if (
        err?.name ===
        "NotReadableError"
      ) {
        setError(
          "Microphone is already being used by another application."
        );
      } else {
        setError(
          "Unable to access microphone."
        );
      }
    }
  };

  // =====================================================
  // STOP RECORDING
  // =====================================================

  const stopRecording = () => {
    const recorder =
      mediaRecorderRef.current;

    if (
      !recorder ||
      recorder.state ===
        "inactive"
    ) {
      return;
    }

    try {
      recorder.stop();
    } catch (err) {
      console.error(
        "STOP RECORDING ERROR:",
        err
      );

      setError(
        "Unable to stop recording."
      );

      stopMediaStream();
    }

    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(
        timerRef.current
      );

      timerRef.current = null;
    }

    console.log(
      "========== RECORDING STOPPED =========="
    );
  };

  // =====================================================
  // PLAY / PAUSE
  // =====================================================

  const togglePlayback = async () => {
    if (
      !audioRef.current ||
      !audioUrl
    ) {
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();

        setIsPlaying(false);

        return;
      }

      await audioRef.current.play();

      setIsPlaying(true);
    } catch (err) {
      console.error(
        "AUDIO PLAYBACK ERROR:",
        err
      );

      setIsPlaying(false);

      setError(
        "Unable to play recorded answer."
      );
    }
  };

  // =====================================================
  // AUDIO ENDED
  // =====================================================

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // =====================================================
  // RECORD AGAIN
  // =====================================================

  const recordAgain = () => {
    if (isRecording) {
      stopRecording();
    }

    clearRecording();

    setError("");

    console.log(
      "========== READY FOR NEW RECORDING =========="
    );
  };

  // =====================================================
  // SUBMIT VOICE ANSWER
  // =====================================================

  const submitVoiceAnswer = async () => {
    if (!audioBlob) {
      setError(
        "Please record your answer first."
      );

      return;
    }

    if (!interview?._id) {
      setError(
        "Interview ID is missing."
      );

      return;
    }

    if (
      interview.status !==
      "in-progress"
    ) {
      setError(
        "Interview is not in progress."
      );

      return;
    }

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      console.log(
        "\n========== SUBMIT VOICE ANSWER =========="
      );

      console.log(
        "Interview ID:",
        interview._id
      );

      console.log(
        "Question Number:",
        getQuestionNumber()
      );

      console.log(
        "Audio Size:",
        audioBlob.size
      );

      console.log(
        "Audio Type:",
        audioBlob.type
      );

      // -------------------------------------------------
      // FORM DATA
      // -------------------------------------------------

      const formData =
        new FormData();

      formData.append(
        "audio",
        audioBlob,
        "interview-answer.webm"
      );

      console.log(
        "FORM DATA AUDIO:",
        formData.get("audio")
      );

      // -------------------------------------------------
      // API
      // -------------------------------------------------

      const response =
        await api.post(
          `/interviews/${interview._id}/voice-answer`,
          formData
        );

      console.log(
        "========== VOICE ANSWER RESPONSE =========="
      );

      console.log(
        response.data
      );

      // -------------------------------------------------
      // EXTRACT RESULT
      // -------------------------------------------------

      const result =
        response?.data?.data ||
        response?.data;

      if (!result) {
        throw new Error(
          "Empty response received from server."
        );
      }

      console.log(
        "PARSED RESULT:",
        result
      );

      // -------------------------------------------------
      // SAVE RESULT FIRST
      // -------------------------------------------------

      setLastResult({
        transcript:
          result?.transcript ||
          "",

        score:
          result?.score ?? 0,

        feedback:
          result?.feedback ||
          "",

        evaluation:
          result?.evaluation ||
          null,

        speechAnalysis:
          result?.speechAnalysis ||
          null,
      });

      // -------------------------------------------------
      // UPDATE INTERVIEW
      // -------------------------------------------------

      if (
        result?.interview?._id
      ) {
        setInterview(
          result.interview
        );
      }

      // -------------------------------------------------
      // IMPORTANT:
      // DO NOT REVOKE AUDIO URL BEFORE
      // STATE/UI UPDATE.
      //
      // Clear audio element safely first.
      // -------------------------------------------------

      if (audioRef.current) {
        try {
          audioRef.current.pause();

          audioRef.current.removeAttribute(
            "src"
          );

          audioRef.current.load();
        } catch (err) {
          console.warn(
            "AUDIO RESET AFTER SUBMIT ERROR:",
            err
          );
        }
      }

      setIsPlaying(false);

      // Revoke current Blob URL safely.
      const submittedAudioUrl =
        audioUrlRef.current;

      if (submittedAudioUrl) {
        try {
          URL.revokeObjectURL(
            submittedAudioUrl
          );
        } catch (err) {
          console.warn(
            "SUBMITTED BLOB REVOKE ERROR:",
            err
          );
        }

        audioUrlRef.current = "";
      }

      setAudioUrl("");

      setAudioBlob(null);

      setRecordingTime(0);

      // -------------------------------------------------
      // INTERVIEW COMPLETED
      // -------------------------------------------------

      const completed =
        result?.completed === true ||
        result?.interview?.status ===
          "completed";

      if (completed) {
        console.log(
          "========== INTERVIEW COMPLETED =========="
        );

        navigate(
          `/dashboard/projects/${id}/interview/${interview._id}/result`,
          {
            replace: true,
            state: {
              interview:
                result?.interview ||
                null,

              finalReport:
                result?.finalReport ||
                result?.interview
                  ?.finalReport ||
                null,

              lastResult: {
                transcript:
                  result?.transcript ||
                  "",

                score:
                  result?.score ??
                  0,

                feedback:
                  result?.feedback ||
                  "",

                evaluation:
                  result?.evaluation ||
                  null,

                speechAnalysis:
                  result?.speechAnalysis ||
                  null,
              },
            },
          }
        );

        return;
      }

      // -------------------------------------------------
      // NEXT QUESTION
      // -------------------------------------------------

      console.log(
        "Answered Questions:",
        result?.answeredQuestions
      );

      console.log(
        "Total Questions:",
        result?.totalQuestions
      );

      console.log(
        "Next Question:",
        result?.nextQuestion
      );

      // Backend returns updated interview
      // with the next question already added.
      if (
        result?.interview?._id
      ) {
        setInterview(
          result.interview
        );
      }

      // Make sure fresh recording starts
      // for next question.
      setLastResult({
        transcript:
          result?.transcript ||
          "",

        score:
          result?.score ?? 0,

        feedback:
          result?.feedback ||
          "",

        evaluation:
          result?.evaluation ||
          null,

        speechAnalysis:
          result?.speechAnalysis ||
          null,
      });

      console.log(
        "========== READY FOR NEXT QUESTION =========="
      );
    } catch (err) {
      console.error(
        "========== VOICE SUBMIT ERROR =========="
      );

      console.error(
        "ERROR:",
        err
      );

      console.error(
        "STATUS:",
        err?.response?.status
      );

      console.error(
        "SERVER RESPONSE:",
        err?.response?.data
      );

      setError(
        getErrorMessage(
          err,
          "Unable to submit answer"
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2
            size={20}
            className="animate-spin text-cyan-400"
          />

          Loading interview...
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="mx-auto max-w-4xl pb-10">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/dashboard/projects/${id}`
              )
            }
            className="rounded-xl border border-white/10 bg-zinc-900 p-2.5 text-zinc-400 transition hover:border-cyan-500 hover:text-white"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Bot
                size={21}
                className="text-cyan-400"
              />

              <h1 className="text-xl font-bold text-white">
                AI Mock Interview
              </h1>
            </div>

            <p className="mt-1 text-sm text-zinc-500">
              Answer each question using
              your voice
            </p>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* NO INTERVIEW */}
      {/* ================================================= */}

      {!interview &&
        !creating && (
          <div className="rounded-2xl border border-white/10 bg-[#111114] p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
              <Sparkles
                size={30}
                className="text-cyan-400"
              />
            </div>

            <h2 className="text-xl font-semibold text-white">
              Start AI Interview
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Start a technical mock
              interview with{" "}
              {TOTAL_QUESTIONS} AI-generated
              questions.
            </p>

            <button
              type="button"
              onClick={createInterview}
              disabled={creating}
              className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? "Creating..."
                : "Create Interview"}
            </button>
          </div>
        )}

      {/* ================================================= */}
      {/* CREATING */}
      {/* ================================================= */}

      {creating && (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-400">
            <Loader2
              size={20}
              className="animate-spin text-cyan-400"
            />

            Creating interview...
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* INTERVIEW */}
      {/* ================================================= */}

      {interview &&
        !creating && (
          <div className="space-y-5">
            {/* ============================================= */}
            {/* COMPLETED */}
            {/* ============================================= */}

            {interview.status ===
              "completed" && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
                <CheckCircle2
                  size={45}
                  className="mx-auto mb-4 text-emerald-400"
                />

                <h2 className="text-xl font-semibold text-white">
                  Interview Completed
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  Your final report is ready.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/dashboard/projects/${id}/interview/${interview._id}/result`
                    )
                  }
                  className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  View Final Report
                </button>
              </div>
            )}

            {/* ============================================= */}
            {/* CREATED */}
            {/* ============================================= */}

            {interview.status ===
              "created" && (
              <div className="rounded-2xl border border-white/10 bg-[#111114] p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10">
                  <Sparkles
                    size={30}
                    className="text-cyan-400"
                  />
                </div>

                <h2 className="text-xl font-semibold text-white">
                  Ready for your interview?
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                  You will answer{" "}
                  {interview.totalQuestions ||
                    TOTAL_QUESTIONS}{" "}
                  technical questions.
                  Your voice answers will be
                  transcribed and evaluated by
                  AI.
                </p>

                <div className="mt-5 flex justify-center gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-400">
                    Type:{" "}
                    <span className="text-white">
                      {interview.type}
                    </span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-400">
                    Difficulty:{" "}
                    <span className="text-white">
                      {interview.difficulty}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startInterview}
                  disabled={starting}
                  className="mt-7 flex mx-auto items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {starting ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Preparing Interview...
                    </>
                  ) : (
                    <>
                      <Sparkles size={17} />

                      Begin Interview
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ============================================= */}
            {/* IN PROGRESS */}
            {/* ============================================= */}

            {interview.status ===
              "in-progress" && (
              <>
                {/* ========================================= */}
                {/* PROGRESS */}
                {/* ========================================= */}

                <div className="rounded-2xl border border-white/10 bg-[#111114] p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-zinc-400">
                      Question{" "}
                      <span className="font-medium text-white">
                        {getQuestionNumber()}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-white">
                        {interview.totalQuestions ||
                          TOTAL_QUESTIONS}
                      </span>
                    </span>

                    <span className="text-xs text-cyan-400">
                      AI Interview
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          (getQuestionNumber() /
                            (interview.totalQuestions ||
                              TOTAL_QUESTIONS)) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* ========================================= */}
                {/* QUESTION */}
                {/* ========================================= */}

                <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
                      <Bot
                        size={18}
                        className="text-cyan-400"
                      />
                    </div>

                    <span className="text-sm font-medium text-zinc-400">
                      AI Interviewer
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold leading-8 text-white">
                    {getCurrentQuestion()
                      ?.question ||
                      "Loading question..."}
                  </h2>
                </div>

                {/* ========================================= */}
                {/* LAST RESULT */}
                {/* ========================================= */}

                {lastResult && (
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-white">
                        Previous Answer
                        Evaluation
                      </h3>

                      <span className="rounded-lg bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-400">
                        {lastResult.score}/10
                      </span>
                    </div>

                    {lastResult.transcript && (
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                          Transcript
                        </p>

                        <div className="rounded-xl bg-black/20 p-4 text-sm leading-6 text-zinc-300">
                          {
                            lastResult.transcript
                          }
                        </div>
                      </div>
                    )}

                    {lastResult.feedback && (
                      <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                          AI Feedback
                        </p>

                        <p className="text-sm leading-6 text-zinc-400">
                          {
                            lastResult.feedback
                          }
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ========================================= */}
                {/* VOICE RECORDER */}
                {/* ========================================= */}

                <div className="rounded-2xl border border-white/10 bg-[#111114] p-6">
                  <div className="mb-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10">
                      <Mic
                        size={32}
                        className={
                          isRecording
                            ? "animate-pulse text-red-400"
                            : "text-cyan-400"
                        }
                      />
                    </div>

                    <h3 className="text-lg font-semibold text-white">
                      {isRecording
                        ? "Recording your answer..."
                        : audioBlob
                        ? "Answer recorded"
                        : "Record your answer"}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {isRecording
                        ? "Speak clearly and confidently"
                        : audioBlob
                        ? "Listen before submitting"
                        : "Click the button below to start"}
                    </p>
                  </div>

                  {/* ======================================= */}
                  {/* TIMER */}
                  {/* ======================================= */}

                  {isRecording && (
                    <div className="mb-5 text-center">
                      <span className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
                        ●{" "}
                        {formatTime(
                          recordingTime
                        )}
                      </span>
                    </div>
                  )}

                  {/* ======================================= */}
                  {/* AUDIO PLAYER */}
                  {/* ======================================= */}

                  {audioUrl &&
                    audioBlob &&
                    !isRecording && (
                      <div className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4">
                        <audio
                          ref={audioRef}
                          src={audioUrl}
                          preload="metadata"
                          onEnded={
                            handleAudioEnded
                          }
                          onError={() => {
                            console.warn(
                              "AUDIO ELEMENT ERROR"
                            );
                          }}
                          className="hidden"
                        />

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={
                              togglePlayback
                            }
                            disabled={
                              submitting
                            }
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-50"
                          >
                            {isPlaying ? (
                              <Pause
                                size={19}
                              />
                            ) : (
                              <Play
                                size={19}
                              />
                            )}
                          </button>

                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              Your recorded
                              answer
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              Duration:{" "}
                              {formatTime(
                                recordingTime
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* ======================================= */}
                  {/* RECORD / STOP */}
                  {/* ======================================= */}

                  {!audioBlob && (
                    <button
                      type="button"
                      onClick={
                        isRecording
                          ? stopRecording
                          : startRecording
                      }
                      disabled={
                        submitting
                      }
                      className={`mx-auto flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        isRecording
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90"
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Square
                            size={17}
                          />

                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic
                            size={17}
                          />

                          Start Recording
                        </>
                      )}
                    </button>
                  )}

                  {/* ======================================= */}
                  {/* ACTION BUTTONS */}
                  {/* ======================================= */}

                  {audioBlob &&
                    !submitting && (
                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                          type="button"
                          onClick={
                            recordAgain
                          }
                          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-cyan-500/40 hover:text-white"
                        >
                          <RotateCcw
                            size={17}
                          />

                          Record Again
                        </button>

                        <button
                          type="button"
                          onClick={
                            submitVoiceAnswer
                          }
                          disabled={
                            !audioBlob ||
                            submitting
                          }
                          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {submitting ? (
                            <>
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />

                              Evaluating...
                            </>
                          ) : (
                            <>
                              Submit Answer
                            </>
                          )}
                        </button>
                      </div>
                    )}

                  {/* ======================================= */}
                  {/* SUBMITTING */}
                  {/* ======================================= */}

                  {submitting && (
                    <div className="mt-4 flex flex-col items-center justify-center gap-2 py-3 text-center">
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Loader2
                          size={17}
                          className="animate-spin text-cyan-400"
                        />

                        Processing your
                        answer...
                      </div>

                      <p className="text-xs text-zinc-600">
                        Transcribing →
                        Evaluating → Preparing
                        next question
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
    </div>
  );
};

export default Interview;
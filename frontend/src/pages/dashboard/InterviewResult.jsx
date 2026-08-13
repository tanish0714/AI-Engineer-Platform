import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  XCircle,
  Lightbulb,
  MessageSquare,
  Brain,
  Gauge,
  Mic,
  Clock,
  Activity,
  Volume2,
  BarChart3,
  Loader2,
} from "lucide-react";

import api from "../../services/api";

const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD INTERVIEW
  // =====================================================

  useEffect(() => {
    const loadResult = async () => {
      if (!id) {
        setError("Interview ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/interviews/${id}`
        );

        console.log(
          "========== INTERVIEW RESULT =========="
        );

        console.log(
          "RAW RESPONSE:",
          response.data
        );

        const data =
          response.data?.data ||
          response.data?.interview ||
          response.data;

        console.log(
          "INTERVIEW RESULT DATA:",
          data
        );

        setInterview(data);
      } catch (err) {
        console.error(
          "INTERVIEW RESULT ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.response?.data?.detail ||
            "Unable to load interview result."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [id]);

  // =====================================================
  // HELPERS
  // =====================================================

  const safeNumber = (value) => {
    const num = Number(value);

    if (Number.isNaN(num)) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(10, num)
    );
  };

  const formatScore = (value) => {
    return safeNumber(value).toFixed(1);
  };

  const getScoreLabel = (score) => {
    const value = safeNumber(score);

    if (value >= 8) return "Excellent";
    if (value >= 6) return "Good";
    if (value >= 4) return "Average";
    return "Needs Improvement";
  };

  const getScoreColor = (score) => {
    const value = safeNumber(score);

    if (value >= 8) {
      return "text-emerald-400";
    }

    if (value >= 6) {
      return "text-blue-400";
    }

    if (value >= 4) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  // =====================================================
  // ANSWERED QUESTIONS
  // =====================================================

  const answeredQuestions = useMemo(() => {
    if (!interview?.questions) {
      return [];
    }

    return interview.questions.filter(
      (question) =>
        question?.answer &&
        question.answer.trim()
    );
  }, [interview]);

  // =====================================================
  // FINAL REPORT
  // =====================================================

  const finalReport =
    interview?.finalReport || {};

  const overallScore = safeNumber(
    finalReport.overallScore ??
      interview?.totalScore ??
      0
  );

  const technicalPerformance =
    safeNumber(
      finalReport.technicalPerformance
    );

  const communication =
    safeNumber(
      finalReport.communication
    );

  const confidence =
    safeNumber(
      finalReport.confidence
    );

  const fluency =
    safeNumber(
      finalReport.fluency
    );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={36}
            className="animate-spin text-blue-400"
          />

          <p className="text-gray-400">
            Loading interview report...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !interview) {
    return (
      <div className="min-h-screen bg-[#0b1020] text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#111827] border border-red-500/20 rounded-2xl p-8 text-center">
          <XCircle
            size={48}
            className="text-red-400 mx-auto mb-4"
          />

          <h2 className="text-xl font-semibold mb-2">
            Unable to load report
          </h2>

          <p className="text-gray-400 mb-6">
            {error ||
              "Interview result not found."}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // SCORE CARD
  // =====================================================

  const ScoreCard = ({
    title,
    value,
    icon,
    description,
  }) => {
    const score = safeNumber(value);

    return (
      <div className="bg-[#111827] border border-white/10 rounded-2xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400">
              {title}
            </p>

            <p
              className={`text-3xl font-bold mt-1 ${getScoreColor(
                score
              )}`}
            >
              {formatScore(score)}
              <span className="text-sm text-gray-500 font-normal">
                {" "}
                / 10
              </span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 text-blue-400">
            {icon}
          </div>
        </div>

        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{
              width: `${score * 10}%`,
            }}
          />
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {description ||
            getScoreLabel(score)}
        </p>
      </div>
    );
  };

  // =====================================================
  // EVALUATION METRIC
  // =====================================================

  const EvaluationMetric = ({
    label,
    value,
  }) => {
    const score = safeNumber(value);

    return (
      <div className="bg-[#0b1020] border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            {label}
          </span>

          <span
            className={`font-bold ${getScoreColor(
              score
            )}`}
          >
            {formatScore(score)}/10
          </span>
        </div>

        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{
              width: `${score * 10}%`,
            }}
          />
        </div>
      </div>
    );
  };

  // =====================================================
  // SPEECH METRIC
  // =====================================================

  const SpeechMetric = ({
    label,
    value,
    suffix = "",
  }) => {
    return (
      <div className="bg-[#0b1020] border border-white/10 rounded-xl p-4">
        <p className="text-xs text-gray-500 mb-1">
          {label}
        </p>

        <p className="text-lg font-semibold text-white">
          {value}
          {suffix}
        </p>
      </div>
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b border-white/10 bg-[#0b1020]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-5"
          >
            <ArrowLeft size={18} />

            <span>
              Back to Interview
            </span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <Award size={24} />
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Interview Report
                  </h1>

                  <p className="text-gray-400 mt-1">
                    AI-powered interview performance analysis
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
                {interview.type}
              </span>

              <span className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
                {interview.difficulty}
              </span>

              <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                {interview.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* =================================================
            OVERALL SCORE
        ================================================= */}

        <section className="mb-8">
          <div className="bg-gradient-to-br from-[#111827] to-[#0f172a] border border-white/10 rounded-3xl p-7">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-center">
              {/* Overall */}

              <div className="flex flex-col items-center justify-center">
                <div className="relative w-44 h-44 rounded-full border-8 border-gray-800 flex items-center justify-center">
                  <div
                    className="absolute inset-[-8px] rounded-full border-8 border-transparent border-t-blue-500 border-r-blue-500"
                    style={{
                      transform: `rotate(${
                        overallScore * 3.6
                      }deg)`,
                    }}
                  />

                  <div className="text-center">
                    <p
                      className={`text-5xl font-bold ${getScoreColor(
                        overallScore
                      )}`}
                    >
                      {formatScore(
                        overallScore
                      )}
                    </p>

                    <p className="text-gray-500 text-sm">
                      / 10
                    </p>
                  </div>
                </div>

                <p className="text-lg font-semibold mt-5">
                  {getScoreLabel(
                    overallScore
                  )}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Overall Performance
                </p>
              </div>

              {/* Summary */}

              <div>
                <h2 className="text-xl font-semibold mb-3">
                  AI Summary
                </h2>

                <p className="text-gray-300 leading-7">
                  {finalReport.summary ||
                    "No final summary available."}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500">
                      Questions
                    </p>

                    <p className="text-xl font-bold mt-1">
                      {
                        answeredQuestions.length
                      }
                      /
                      {interview.totalQuestions ||
                        answeredQuestions.length}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500">
                      Type
                    </p>

                    <p className="text-xl font-bold mt-1">
                      {interview.type}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500">
                      Difficulty
                    </p>

                    <p className="text-xl font-bold mt-1">
                      {interview.difficulty}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs text-gray-500">
                      Status
                    </p>

                    <p className="text-xl font-bold mt-1 text-emerald-400">
                      {interview.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            FINAL PERFORMANCE METRICS
        ================================================= */}

        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <BarChart3
              size={22}
              className="text-blue-400"
            />

            <h2 className="text-xl font-semibold">
              Performance Metrics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ScoreCard
              title="Technical Performance"
              value={
                technicalPerformance
              }
              icon={<Brain size={20} />}
              description="Correctness, completeness & technical depth"
            />

            <ScoreCard
              title="Communication"
              value={communication}
              icon={
                <MessageSquare
                  size={20}
                />
              }
              description="Clarity and structure of answers"
            />

            <ScoreCard
              title="Confidence"
              value={confidence}
              icon={
                <Gauge size={20} />
              }
              description="Confidence in responses"
            />

            <ScoreCard
              title="Fluency"
              value={fluency}
              icon={
                <Volume2 size={20} />
              }
              description="Speech fluency and delivery"
            />
          </div>
        </section>

        {/* =================================================
            STRENGTHS / WEAKNESSES / SUGGESTIONS
        ================================================= */}

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
          {/* Strengths */}

          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2
                size={21}
                className="text-emerald-400"
              />

              <h3 className="font-semibold text-lg">
                Strengths
              </h3>
            </div>

            {Array.isArray(
              finalReport.strengths
            ) &&
            finalReport.strengths.length > 0 ? (
              <div className="space-y-3">
                {finalReport.strengths.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex gap-3"
                    >
                      <span className="text-emerald-400 mt-1">
                        •
                      </span>

                      <p className="text-gray-300 text-sm leading-6">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No strengths available.
              </p>
            )}
          </div>

          {/* Weaknesses */}

          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <XCircle
                size={21}
                className="text-red-400"
              />

              <h3 className="font-semibold text-lg">
                Weaknesses
              </h3>
            </div>

            {Array.isArray(
              finalReport.weaknesses
            ) &&
            finalReport.weaknesses.length > 0 ? (
              <div className="space-y-3">
                {finalReport.weaknesses.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex gap-3"
                    >
                      <span className="text-red-400 mt-1">
                        •
                      </span>

                      <p className="text-gray-300 text-sm leading-6">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No weaknesses available.
              </p>
            )}
          </div>

          {/* Suggestions */}

          <div className="bg-[#111827] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb
                size={21}
                className="text-yellow-400"
              />

              <h3 className="font-semibold text-lg">
                Suggestions
              </h3>
            </div>

            {Array.isArray(
              finalReport.suggestions
            ) &&
            finalReport.suggestions.length > 0 ? (
              <div className="space-y-3">
                {finalReport.suggestions.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex gap-3"
                    >
                      <span className="text-yellow-400 mt-1">
                        •
                      </span>

                      <p className="text-gray-300 text-sm leading-6">
                        {item}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                No suggestions available.
              </p>
            )}
          </div>
        </section>

        {/* =================================================
            QUESTION BY QUESTION REPORT
        ================================================= */}

        <section>
          <div className="flex items-center gap-3 mb-5">
            <Award
              size={22}
              className="text-blue-400"
            />

            <h2 className="text-xl font-semibold">
              Question-wise Evaluation
            </h2>
          </div>

          <div className="space-y-6">
            {answeredQuestions.map(
              (question, index) => {
                const evaluation =
                  question.evaluation ||
                  {};

                const speech =
                  question.speechAnalysis ||
                  {};

                const score = safeNumber(
                  question.score
                );

                return (
                  <div
                    key={
                      question._id ||
                      index
                    }
                    className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden"
                  >
                    {/* Question Header */}

                    <div className="px-6 py-5 border-b border-white/10">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>

                          <h3 className="font-semibold">
                            Question{" "}
                            {index + 1}
                          </h3>
                        </div>

                        <div
                          className={`text-xl font-bold ${getScoreColor(
                            score
                          )}`}
                        >
                          {formatScore(
                            score
                          )}
                          <span className="text-sm text-gray-500 font-normal">
                            {" "}
                            / 10
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 leading-7 mt-4">
                        {question.question}
                      </p>
                    </div>

                    {/* Question Body */}

                    <div className="p-6 space-y-6">
                      {/* =============================
                          ANSWER / TRANSCRIPT
                      ============================= */}

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Mic
                            size={18}
                            className="text-purple-400"
                          />

                          <h4 className="font-semibold">
                            Your Answer / Transcript
                          </h4>
                        </div>

                        <div className="bg-[#0b1020] border border-white/10 rounded-xl p-5">
                          <p className="text-gray-300 leading-7 whitespace-pre-wrap">
                            {question.answer ||
                              "No transcript available."}
                          </p>
                        </div>
                      </div>

                      {/* =============================
                          AI FEEDBACK
                      ============================= */}

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare
                            size={18}
                            className="text-blue-400"
                          />

                          <h4 className="font-semibold">
                            AI Feedback
                          </h4>
                        </div>

                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-5">
                          <p className="text-gray-300 leading-7">
                            {question.feedback ||
                              "No feedback available."}
                          </p>
                        </div>
                      </div>

                      {/* =============================
                          EVALUATION BREAKDOWN
                      ============================= */}

                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart3
                            size={18}
                            className="text-emerald-400"
                          />

                          <h4 className="font-semibold">
                            Evaluation Breakdown
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          <EvaluationMetric
                            label="Correctness"
                            value={
                              evaluation.correctness
                            }
                          />

                          <EvaluationMetric
                            label="Completeness"
                            value={
                              evaluation.completeness
                            }
                          />

                          <EvaluationMetric
                            label="Technical Depth"
                            value={
                              evaluation.technicalDepth
                            }
                          />

                          <EvaluationMetric
                            label="Communication"
                            value={
                              evaluation.communication
                            }
                          />

                          <EvaluationMetric
                            label="Confidence"
                            value={
                              evaluation.confidence
                            }
                          />

                          <EvaluationMetric
                            label="Overall Score"
                            value={score}
                          />
                        </div>
                      </div>

                      {/* =============================
                          SPEECH ANALYSIS
                      ============================= */}

                      {question.answerType ===
                        "voice" && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Activity
                              size={18}
                              className="text-purple-400"
                            />

                            <h4 className="font-semibold">
                              Speech Analysis
                            </h4>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <SpeechMetric
                              label="Duration"
                              value={
                                Number(
                                  speech.duration ||
                                    0
                                ).toFixed(1)
                              }
                              suffix=" sec"
                            />

                            <SpeechMetric
                              label="Word Count"
                              value={
                                speech.wordCount ||
                                0
                              }
                            />

                            <SpeechMetric
                              label="Words / Minute"
                              value={
                                Number(
                                  speech.wordsPerMinute ||
                                    0
                                ).toFixed(1)
                              }
                            />

                            <SpeechMetric
                              label="Fluency"
                              value={
                                Number(
                                  speech.fluency ||
                                    0
                                ).toFixed(1)
                              }
                              suffix=" / 10"
                            />

                            <SpeechMetric
                              label="Filler Words"
                              value={
                                speech.fillerWordCount ||
                                0
                              }
                            />

                            <SpeechMetric
                              label="Pauses"
                              value={
                                speech.pauseCount ||
                                0
                              }
                            />

                            <SpeechMetric
                              label="Answer Type"
                              value="Voice"
                            />

                            <SpeechMetric
                              label="Score"
                              value={formatScore(
                                score
                              )}
                              suffix=" / 10"
                            />
                          </div>

                          {Array.isArray(
                            speech.fillerWords
                          ) &&
                            speech
                              .fillerWords
                              .length >
                              0 && (
                              <div className="mt-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-4">
                                <p className="text-sm text-gray-400 mb-2">
                                  Filler words detected
                                </p>

                                <div className="flex flex-wrap gap-2">
                                  {speech.fillerWords.map(
                                    (
                                      word,
                                      wordIndex
                                    ) => (
                                      <span
                                        key={
                                          wordIndex
                                        }
                                        className="px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs"
                                      >
                                        {word}
                                      </span>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex justify-center pt-10 pb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium"
          >
            <ArrowLeft size={18} />

            Back to Interview
          </button>
        </div>
      </main>
    </div>
  );
};

export default InterviewResult;
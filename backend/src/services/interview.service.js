import Interview from "../models/interview.model.js";
import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";

import fs from "fs/promises";

// =====================================================
// AI SERVICE
// =====================================================

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL ||
  "http://127.0.0.1:8000";

const QUESTION_URL =
  `${AI_SERVICE_URL}/chat/pdf`;

const TRANSCRIBE_URL =
  `${AI_SERVICE_URL}/interview/transcribe`;

const EVALUATE_URL =
  `${AI_SERVICE_URL}/interview/evaluate`;

const REPORT_URL =
  `${AI_SERVICE_URL}/interview/report`;

// =====================================================
// CONSTANTS
// =====================================================

const TOTAL_QUESTIONS = 5;

// =====================================================
// SMALL HELPERS
// =====================================================

const clampScore = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(
    10,
    Math.max(0, number)
  );
};

const safeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
};

const safeArray = (value) => {
  return Array.isArray(value)
    ? value
    : [];
};

// =====================================================
// AI RESPONSE PARSER
// =====================================================

const parseAIResponse = async (
  response,
  serviceName = "AI service"
) => {
  const rawText =
    await response.text();

  console.log(
    `\n========== ${serviceName.toUpperCase()} RESPONSE ==========`
  );

  console.log(
    "STATUS:",
    response.status
  );

  console.log(
    "CONTENT TYPE:",
    response.headers.get(
      "content-type"
    )
  );

  console.log(
    "BODY:",
    rawText
  );

  console.log(
    "====================================================\n"
  );

  let data = {};

  if (rawText?.trim()) {
    try {
      data = JSON.parse(rawText);
    } catch (error) {
      throw new ApiError(
        502,
        `${serviceName} returned invalid JSON`
      );
    }
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.detail ||
        data?.message ||
        `${serviceName} request failed`
    );
  }

  return data;
};

// =====================================================
// BUILD EMPTY QUESTION
// =====================================================

const createQuestionObject = (
  question,
  answerType = "voice"
) => ({
  question,

  answer: "",

  feedback: "",

  score: 0,

  evaluation: {
    correctness: 0,
    completeness: 0,
    technicalDepth: 0,
    communication: 0,
    confidence: 0,
  },

  speechAnalysis: {
    duration: 0,
    wordCount: 0,
    wordsPerMinute: 0,
    fillerWordCount: 0,
    fillerWords: [],
    pauseCount: 0,
    fluency: 0,
  },

  answerType,
});

// =====================================================
// INTERVIEW SERVICE
// =====================================================

class InterviewService {

  // ===================================================
  // CREATE INTERVIEW
  // ===================================================

  async createInterview(
    projectId,
    userId,
    type,
    difficulty = "Medium"
  ) {
    const project =
      await Project.findById(projectId);

    if (!project) {
      throw new ApiError(
        404,
        "Project not found"
      );
    }

    // -------------------------------------------------
    // OWNERSHIP
    // -------------------------------------------------

    if (
      project.owner.toString() !==
      userId.toString()
    ) {
      throw new ApiError(
        403,
        "Unauthorized"
      );
    }

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    const allowedTypes = [
      "DSA",
      "Core CS",
      "Backend",
      "Frontend",
      "Resume Based",
    ];

    const allowedDifficulties = [
      "Easy",
      "Medium",
      "Hard",
    ];

    if (!allowedTypes.includes(type)) {
      throw new ApiError(
        400,
        "Invalid interview type"
      );
    }

    if (
      !allowedDifficulties.includes(
        difficulty
      )
    ) {
      difficulty = "Medium";
    }

    // -------------------------------------------------
    // CREATE
    // -------------------------------------------------

    const interview =
      await Interview.create({
        project: projectId,

        user: userId,

        type,

        difficulty,

        status: "created",

        questions: [],

        totalQuestions:
          TOTAL_QUESTIONS,

        currentQuestionIndex: 0,

        totalScore: 0,

        finalReport: {
          overallScore: 0,
          technicalPerformance: 0,
          communication: 0,
          confidence: 0,
          fluency: 0,
          strengths: [],
          weaknesses: [],
          suggestions: [],
          summary: "",
        },
      });

    return interview;
  }

  // ===================================================
  // GENERATE INTERVIEW QUESTION
  // ===================================================

  async generateQuestion(
    interview
  ) {
    const questionNumber =
      interview.questions.length + 1;

    const previousQuestions =
      interview.questions
        .map(
          (item) =>
            item.question
        )
        .filter(Boolean);

    let previousQuestionText = "";

    if (
      previousQuestions.length > 0
    ) {
      previousQuestionText = `
Previously asked questions:

${previousQuestions
  .map(
    (question, index) =>
      `${index + 1}. ${question}`
  )
  .join("\n")}

Do NOT repeat any previous question.
`;
    }

    const prompt = `
You are conducting a professional technical mock interview.

Interview type:
${interview.type}

Difficulty:
${interview.difficulty}

Question:
${questionNumber} of ${interview.totalQuestions}

Generate exactly ONE technical interview question.

Rules:
1. Ask exactly ONE question.
2. Do not provide the answer.
3. Do not provide hints.
4. Do not explain the question.
5. Keep it suitable for a real technical interview.
6. Make it relevant to the candidate's project.
7. For Resume Based interviews, use uploaded project information.
8. Do not repeat previous questions.
9. Return ONLY the question.

${previousQuestionText}
`.trim();

    try {
      const response =
        await fetch(
          QUESTION_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              project_id:
                interview.project.toString(),

              question: prompt,
            }),
          }
        );

      const data =
        await parseAIResponse(
          response,
          "Question service"
        );

      const question =
        data?.answer?.trim();

      if (!question) {
        throw new ApiError(
          500,
          "AI did not generate an interview question"
        );
      }

      return question;

    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        throw error;
      }

      throw new ApiError(
        502,
        `Unable to generate interview question: ${error.message}`
      );
    }
  }

  // ===================================================
  // START INTERVIEW
  // ===================================================

  async startInterview(
    interviewId,
    userId
  ) {
    const interview =
      await Interview.findOne({
        _id: interviewId,
        user: userId,
      });

    if (!interview) {
      throw new ApiError(
        404,
        "Interview not found"
      );
    }

    if (
      interview.status ===
      "completed"
    ) {
      throw new ApiError(
        400,
        "Interview already completed"
      );
    }

    // -------------------------------------------------
    // PROJECT OWNERSHIP
    // -------------------------------------------------

    const project =
      await Project.findOne({
        _id: interview.project,
        owner: userId,
      });

    if (!project) {
      throw new ApiError(
        404,
        "Project not found"
      );
    }

    // -------------------------------------------------
    // ALREADY STARTED
    // -------------------------------------------------

    if (
      interview.questions.length > 0
    ) {
      return interview;
    }

    // -------------------------------------------------
    // FIRST QUESTION
    // -------------------------------------------------

    const question =
      await this.generateQuestion(
        interview
      );

    interview.questions.push(
      createQuestionObject(
        question,
        "voice"
      )
    );

    interview.status =
      "in-progress";

    interview.currentQuestionIndex =
      0;

    await interview.save();

    return interview;
  }

  // ===================================================
  // EVALUATE ANSWER USING GEMINI SERVICE
  // ===================================================

  async evaluateAnswer(
    question,
    answer,
    difficulty
  ) {
    const response =
      await fetch(
        EVALUATE_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            question,
            answer,
            difficulty,
          }),
        }
      );

    return await parseAIResponse(
      response,
      "Gemini evaluation service"
    );
  }

  // ===================================================
  // TRANSCRIBE AUDIO
  // ===================================================

  async transcribeAudio(
    file
  ) {
    if (!file?.path) {
      throw new ApiError(
        400,
        "Audio file is required"
      );
    }

    let audioBuffer;

    try {
      audioBuffer =
        await fs.readFile(
          file.path
        );
    } catch (error) {
      throw new ApiError(
        500,
        "Unable to read uploaded audio file"
      );
    }

    if (
      !audioBuffer ||
      audioBuffer.length === 0
    ) {
      throw new ApiError(
        400,
        "Uploaded audio file is empty"
      );
    }

    // -------------------------------------------------
    // NATIVE FORMDATA
    // Node 18+ native FormData + Blob
    // -------------------------------------------------

    const formData =
      new FormData();

    const audioBlob =
      new Blob(
        [audioBuffer],
        {
          type:
            file.mimetype ||
            "audio/webm",
        }
      );

    formData.append(
      "audio",
      audioBlob,
      file.originalname ||
        "interview-answer.webm"
    );

    console.log(
      "\n========== STT REQUEST =========="
    );

    console.log(
      "URL:",
      TRANSCRIBE_URL
    );

    console.log(
      "File:",
      file.originalname
    );

    console.log(
      "Mimetype:",
      file.mimetype
    );

    console.log(
      "Size:",
      audioBuffer.length
    );

    try {
      const response =
        await fetch(
          TRANSCRIBE_URL,
          {
            method: "POST",

            body: formData,
          }
        );

      const data =
        await parseAIResponse(
          response,
          "Speech-to-text service"
        );

      const transcript =
        data?.transcript?.trim();

      if (!transcript) {
        throw new ApiError(
          422,
          "Speech-to-text service returned an empty transcript"
        );
      }

      return data;

    } catch (error) {
      if (
        error instanceof ApiError
      ) {
        throw error;
      }

      throw new ApiError(
        502,
        `Speech-to-text service failed: ${error.message}`
      );
    }
  }

  // ===================================================
  // SAVE EVALUATION
  // ===================================================

  saveQuestionEvaluation(
    question,
    answer,
    answerType,
    evaluationData,
    speechAnalysis = {}
  ) {
    question.answer =
      answer.trim();

    question.answerType =
      answerType;

    question.score =
      clampScore(
        evaluationData?.score
      );

    question.feedback =
      evaluationData?.feedback ||
      "";

    const evaluation =
      evaluationData?.evaluation ||
      {};

    question.evaluation = {
      correctness:
        clampScore(
          evaluation.correctness
        ),

      completeness:
        clampScore(
          evaluation.completeness
        ),

      technicalDepth:
        clampScore(
          evaluation.technicalDepth
        ),

      communication:
        clampScore(
          evaluation.communication
        ),

      confidence:
        clampScore(
          evaluation.confidence
        ),
    };

    question.speechAnalysis = {
      duration:
        safeNumber(
          speechAnalysis.duration
        ),

      wordCount:
        safeNumber(
          speechAnalysis.wordCount
        ),

      wordsPerMinute:
        safeNumber(
          speechAnalysis.wordsPerMinute
        ),

      fillerWordCount:
        safeNumber(
          speechAnalysis.fillerWordCount
        ),

      fillerWords:
        safeArray(
          speechAnalysis.fillerWords
        ),

      pauseCount:
        safeNumber(
          speechAnalysis.pauseCount
        ),

      fluency:
        clampScore(
          speechAnalysis.fluency
        ),
    };

    return question;
  }

  // ===================================================
  // CALCULATE TOTAL SCORE
  // ===================================================

  calculateTotalScore(
    interview
  ) {
    const answeredQuestions =
      interview.questions.filter(
        (question) =>
          question.answer?.trim()
      );

    if (
      answeredQuestions.length === 0
    ) {
      return 0;
    }

    const total =
      answeredQuestions.reduce(
        (sum, question) =>
          sum +
          clampScore(
            question.score
          ),
        0
      );

    return Number(
      (
        total /
        answeredQuestions.length
      ).toFixed(2)
    );
  }

  // ===================================================
  // GENERATE FINAL REPORT
  // ===================================================

  async generateFinalReport(
    interview
  ) {
    const answeredQuestions =
      interview.questions.filter(
        (question) =>
          question.answer?.trim()
      );

    if (
      answeredQuestions.length === 0
    ) {
      throw new ApiError(
        400,
        "No evaluated answers found"
      );
    }

    // -------------------------------------------------
    // PREPARE ANSWERS
    // -------------------------------------------------

    const answers =
      answeredQuestions.map(
        (question, index) => ({
          questionNumber:
            index + 1,

          question:
            question.question,

          answer:
            question.answer,

          score:
            clampScore(
              question.score
            ),

          feedback:
            question.feedback ||
            "",

          evaluation:
            question.evaluation ||
            {},

          speechAnalysis:
            question.speechAnalysis ||
            {},
        })
      );

    // -------------------------------------------------
    // FINAL AI REPORT
    // -------------------------------------------------

    let report = {};

    try {
      const response =
        await fetch(
          REPORT_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              interviewType:
                interview.type,

              difficulty:
                interview.difficulty,

              questions:
                answers,

              answers,
            }),
          }
        );

      const data =
        await parseAIResponse(
          response,
          "Final report service"
        );

      // Supports:
      // { report: {...} }
      // OR
      // { overallScore: ... }

      report =
        data?.report ||
        data ||
        {};

    } catch (error) {
      console.error(
        "FINAL REPORT AI ERROR:",
        error.message
      );

      // ------------------------------------------------
      // FALLBACK
      // ------------------------------------------------

      const totalScore =
        this.calculateTotalScore(
          interview
        );

      report = {
        overallScore:
          totalScore,

        technicalPerformance:
          totalScore,

        communication: 0,

        confidence: 0,

        fluency: 0,

        strengths: [],

        weaknesses: [],

        suggestions: [],

        summary:
          "Interview completed. AI final report was unavailable.",
      };
    }

    // -------------------------------------------------
    // CALCULATE REAL OVERALL SCORE
    // -------------------------------------------------

    const totalScore =
      this.calculateTotalScore(
        interview
      );

    interview.totalScore =
      totalScore;

    // -------------------------------------------------
    // FINAL REPORT
    // -------------------------------------------------

    interview.finalReport = {
      overallScore:
        clampScore(
          report.overallScore ??
            totalScore
        ),

      technicalPerformance:
        clampScore(
          report.technicalPerformance
        ),

      communication:
        clampScore(
          report.communication
        ),

      confidence:
        clampScore(
          report.confidence
        ),

      fluency:
        clampScore(
          report.fluency
        ),

      strengths:
        safeArray(
          report.strengths
        ),

      weaknesses:
        safeArray(
          report.weaknesses
        ),

      suggestions:
        safeArray(
          report.suggestions
        ),

      summary:
        report.summary ||
        "",
    };

    interview.status =
      "completed";

    interview.currentQuestionIndex =
      Math.max(
        0,
        interview.questions.length - 1
      );

    await interview.save();

    return interview;
  }

  // ===================================================
  // GENERATE NEXT QUESTION
  // ===================================================

  async generateNextQuestion(
    interview,
    answerType = "voice"
  ) {
    if (
      interview.questions.length >=
      interview.totalQuestions
    ) {
      return null;
    }

    const question =
      await this.generateQuestion(
        interview
      );

    interview.questions.push(
      createQuestionObject(
        question,
        answerType
      )
    );

    interview.currentQuestionIndex =
      interview.questions.length - 1;

    await interview.save();

    return interview;
  }

  // ===================================================
  // SUBMIT VOICE ANSWER
  // ===================================================

  async submitVoiceAnswer(
    interviewId,
    userId,
    file
  ) {
    if (!file) {
      throw new ApiError(
        400,
        "Audio answer is required"
      );
    }

    const interview =
      await Interview.findOne({
        _id: interviewId,
        user: userId,
      });

    if (!interview) {
      throw new ApiError(
        404,
        "Interview not found"
      );
    }

    if (
      interview.status !==
      "in-progress"
    ) {
      throw new ApiError(
        400,
        "Interview is not in progress"
      );
    }

    if (
      !interview.questions.length
    ) {
      throw new ApiError(
        400,
        "No interview question found"
      );
    }

    const questionIndex =
      interview.questions.length - 1;

    const currentQuestion =
      interview.questions[
        questionIndex
      ];

    try {
      // ================================================
      // STEP 1 — SPEECH TO TEXT
      // ================================================

      console.log(
        "\n========== VOICE ANSWER =========="
      );

      console.log(
        "Interview:",
        interviewId
      );

      console.log(
        "Question:",
        questionIndex + 1,
        "/",
        interview.totalQuestions
      );

      const transcriptionData =
        await this.transcribeAudio(
          file
        );

      const transcript =
        transcriptionData?.transcript?.trim();

      if (!transcript) {
        throw new ApiError(
          422,
          "Unable to transcribe audio"
        );
      }

      // ================================================
      // STEP 2 — GEMINI EVALUATION
      // ================================================

      const evaluationData =
        await this.evaluateAnswer(
          currentQuestion.question,
          transcript,
          interview.difficulty
        );

      // ================================================
      // STEP 3 — SAVE ANSWER
      // ================================================

      const speechAnalysis =
        transcriptionData?.speechAnalysis ||
        {};

      this.saveQuestionEvaluation(
        currentQuestion,
        transcript,
        "voice",
        evaluationData,
        speechAnalysis
      );

      // ================================================
      // STEP 4 — UPDATE SCORE
      // ================================================

      interview.totalScore =
        this.calculateTotalScore(
          interview
        );

      const answeredCount =
        interview.questions.filter(
          (question) =>
            question.answer?.trim()
        ).length;

      // ================================================
      // STEP 5 — FINAL QUESTION
      // ================================================

      if (
        answeredCount >=
        interview.totalQuestions
      ) {
        const completedInterview =
          await this.generateFinalReport(
            interview
          );

        return {
          completed: true,

          interviewStatus:
            "completed",

          interviewId:
            completedInterview._id,

          transcript,

          question:
            currentQuestion.question,

          answer:
            currentQuestion.answer,

          score:
            currentQuestion.score,

          feedback:
            currentQuestion.feedback,

          evaluation:
            currentQuestion.evaluation,

          speechAnalysis:
            currentQuestion.speechAnalysis,

          answeredQuestions:
            answeredCount,

          totalQuestions:
            interview.totalQuestions,

          nextQuestion: null,

          interview:
            completedInterview,

          finalReport:
            completedInterview.finalReport,
        };
      }

      // ================================================
      // STEP 6 — GENERATE NEXT QUESTION
      // ================================================

      const updatedInterview =
        await this.generateNextQuestion(
          interview,
          "voice"
        );

      const nextQuestion =
        updatedInterview.questions[
          updatedInterview.questions.length - 1
        ];

      return {
        completed: false,

        interviewStatus:
          "in-progress",

        interviewId:
          updatedInterview._id,

        transcript,

        question:
          currentQuestion.question,

        answer:
          currentQuestion.answer,

        score:
          currentQuestion.score,

        feedback:
          currentQuestion.feedback,

        evaluation:
          currentQuestion.evaluation,

        speechAnalysis:
          currentQuestion.speechAnalysis,

        answeredQuestions:
          answeredCount,

        totalQuestions:
          updatedInterview.totalQuestions,

        nextQuestion:
          nextQuestion.question,

        interview:
          updatedInterview,

        finalReport: null,
      };

    } finally {
      // ================================================
      // DELETE TEMP AUDIO
      // ================================================

      if (file?.path) {
        try {
          await fs.unlink(
            file.path
          );

          console.log(
            "Temporary audio deleted:",
            file.path
          );

        } catch (error) {
          console.warn(
            "Unable to delete temporary audio:",
            error.message
          );
        }
      }
    }
  }

  // ===================================================
  // SUBMIT TEXT ANSWER
  // ===================================================

  async submitAnswer(
    interviewId,
    userId,
    answer
  ) {
    if (
      !answer ||
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      throw new ApiError(
        400,
        "Answer is required"
      );
    }

    const interview =
      await Interview.findOne({
        _id: interviewId,
        user: userId,
      });

    if (!interview) {
      throw new ApiError(
        404,
        "Interview not found"
      );
    }

    if (
      interview.status !==
      "in-progress"
    ) {
      throw new ApiError(
        400,
        "Interview is not in progress"
      );
    }

    if (
      !interview.questions.length
    ) {
      throw new ApiError(
        400,
        "No interview question found"
      );
    }

    const questionIndex =
      interview.questions.length - 1;

    const currentQuestion =
      interview.questions[
        questionIndex
      ];

    // ================================================
    // GEMINI EVALUATION
    // ================================================

    const evaluationData =
      await this.evaluateAnswer(
        currentQuestion.question,
        answer.trim(),
        interview.difficulty
      );

    // ================================================
    // SAVE
    // ================================================

    this.saveQuestionEvaluation(
      currentQuestion,
      answer.trim(),
      "text",
      evaluationData,
      {}
    );

    // ================================================
    // UPDATE SCORE
    // ================================================

    interview.totalScore =
      this.calculateTotalScore(
        interview
      );

    const answeredCount =
      interview.questions.filter(
        (question) =>
          question.answer?.trim()
      ).length;

    // ================================================
    // FINAL QUESTION
    // ================================================

    if (
      answeredCount >=
      interview.totalQuestions
    ) {
      const completedInterview =
        await this.generateFinalReport(
          interview
        );

      return {
        completed: true,

        interviewStatus:
          "completed",

        interviewId:
          completedInterview._id,

        question:
          currentQuestion.question,

        answer:
          currentQuestion.answer,

        score:
          currentQuestion.score,

        feedback:
          currentQuestion.feedback,

        evaluation:
          currentQuestion.evaluation,

        speechAnalysis:
          currentQuestion.speechAnalysis,

        answeredQuestions:
          answeredCount,

        totalQuestions:
          interview.totalQuestions,

        nextQuestion: null,

        interview:
          completedInterview,

        finalReport:
          completedInterview.finalReport,
      };
    }

    // ================================================
    // NEXT QUESTION
    // ================================================

    const updatedInterview =
      await this.generateNextQuestion(
        interview,
        "text"
      );

    const nextQuestion =
      updatedInterview.questions[
        updatedInterview.questions.length - 1
      ];

    return {
      completed: false,

      interviewStatus:
        "in-progress",

      interviewId:
        updatedInterview._id,

      question:
        currentQuestion.question,

      answer:
        currentQuestion.answer,

      score:
        currentQuestion.score,

      feedback:
        currentQuestion.feedback,

      evaluation:
        currentQuestion.evaluation,

      speechAnalysis:
        currentQuestion.speechAnalysis,

      answeredQuestions:
        answeredCount,

      totalQuestions:
        updatedInterview.totalQuestions,

      nextQuestion:
        nextQuestion.question,

      interview:
        updatedInterview,

      finalReport: null,
    };
  }

  // ===================================================
  // GET PROJECT INTERVIEWS
  // ===================================================

  async getProjectInterviews(
    projectId,
    userId
  ) {
    const project =
      await Project.findById(
        projectId
      );

    if (!project) {
      throw new ApiError(
        404,
        "Project not found"
      );
    }

    if (
      project.owner.toString() !==
      userId.toString()
    ) {
      throw new ApiError(
        403,
        "Unauthorized"
      );
    }

    return await Interview.find({
      project: projectId,
      user: userId,
    }).sort({
      createdAt: -1,
    });
  }

  // ===================================================
  // GET SINGLE INTERVIEW
  // ===================================================

  async getInterview(
    interviewId,
    userId
  ) {
    const interview =
      await Interview.findOne({
        _id: interviewId,
        user: userId,
      });

    if (!interview) {
      throw new ApiError(
        404,
        "Interview not found"
      );
    }

    return interview;
  }
}

// =====================================================
// EXPORT
// =====================================================

export default new InterviewService();
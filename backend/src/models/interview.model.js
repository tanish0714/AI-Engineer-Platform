import mongoose from "mongoose";

// =====================================================
// QUESTION SCHEMA
// =====================================================

const questionSchema = new mongoose.Schema(
  {
    // ===================================================
    // QUESTION
    // ===================================================

    question: {
      type: String,
      required: true,
      trim: true,
    },

    // ===================================================
    // CANDIDATE ANSWER
    // ===================================================

    answer: {
      type: String,
      default: "",
      trim: true,
    },

    // ===================================================
    // AI FEEDBACK
    // ===================================================

    feedback: {
      type: String,
      default: "",
      trim: true,
    },

    // ===================================================
    // OVERALL QUESTION SCORE
    // ===================================================

    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    // ===================================================
    // AI EVALUATION BREAKDOWN
    // ===================================================

    evaluation: {
      correctness: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      completeness: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      technicalDepth: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      communication: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      confidence: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
    },

    // ===================================================
    // SPEECH ANALYSIS
    // ===================================================

    speechAnalysis: {
      duration: {
        type: Number,
        default: 0,
        min: 0,
      },

      wordCount: {
        type: Number,
        default: 0,
        min: 0,
      },

      wordsPerMinute: {
        type: Number,
        default: 0,
        min: 0,
      },

      fillerWordCount: {
        type: Number,
        default: 0,
        min: 0,
      },

      fillerWords: {
        type: [String],
        default: [],
      },

      pauseCount: {
        type: Number,
        default: 0,
        min: 0,
      },

      fluency: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
    },

    // ===================================================
    // ANSWER TYPE
    // ===================================================

    answerType: {
      type: String,
      enum: ["text", "voice"],
      default: "voice",
    },

    // ===================================================
    // ANSWER STATUS
    // ===================================================

    answered: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  }
);

// =====================================================
// INTERVIEW SCHEMA
// =====================================================

const interviewSchema = new mongoose.Schema(
  {
    // ===================================================
    // PROJECT
    // ===================================================

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // ===================================================
    // USER
    // ===================================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ===================================================
    // INTERVIEW TYPE
    // ===================================================

    type: {
      type: String,
      enum: [
        "DSA",
        "Core CS",
        "Backend",
        "Frontend",
        "Resume Based",
      ],
      required: true,
    },

    // ===================================================
    // DIFFICULTY
    // ===================================================

    difficulty: {
      type: String,
      enum: [
        "Easy",
        "Medium",
        "Hard",
      ],
      default: "Medium",
    },

    // ===================================================
    // INTERVIEW STATUS
    // ===================================================

    status: {
      type: String,
      enum: [
        "created",
        "in-progress",
        "completed",
      ],
      default: "created",
    },

    // ===================================================
    // QUESTIONS
    // ===================================================

    questions: {
      type: [questionSchema],
      default: [],
    },

    // ===================================================
    // INTERVIEW CONFIG
    // ===================================================

    totalQuestions: {
      type: Number,
      default: 5,
      min: 1,
    },

    currentQuestionIndex: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ===================================================
    // TOTAL SCORE
    // ===================================================

    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ===================================================
    // FINAL REPORT
    // ===================================================

    finalReport: {
      // -----------------------------------------------
      // OVERALL PERFORMANCE
      // -----------------------------------------------

      overallScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      // -----------------------------------------------
      // TECHNICAL PERFORMANCE
      // -----------------------------------------------

      technicalPerformance: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      // -----------------------------------------------
      // COMMUNICATION
      // -----------------------------------------------

      communication: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      // -----------------------------------------------
      // CONFIDENCE
      // -----------------------------------------------

      confidence: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      // -----------------------------------------------
      // FLUENCY
      // -----------------------------------------------

      fluency: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },

      // -----------------------------------------------
      // STRENGTHS
      // -----------------------------------------------

      strengths: {
        type: [String],
        default: [],
      },

      // -----------------------------------------------
      // WEAKNESSES
      // -----------------------------------------------

      weaknesses: {
        type: [String],
        default: [],
      },

      // -----------------------------------------------
      // SUGGESTIONS
      // -----------------------------------------------

      suggestions: {
        type: [String],
        default: [],
      },

      // -----------------------------------------------
      // FINAL SUMMARY
      // -----------------------------------------------

      summary: {
        type: String,
        default: "",
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// MODEL
// =====================================================

export default mongoose.model(
  "Interview",
  interviewSchema
);
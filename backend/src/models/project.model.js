import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC PROJECT DETAILS
    // ==========================================

    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    // ==========================================
    // GITHUB INTEGRATION
    // ==========================================

    github: {
      connected: {
        type: Boolean,
        default: false,
      },

      repositoryUrl: {
        type: String,
        default: "",
        trim: true,
      },

      repositoryName: {
        type: String,
        default: "",
        trim: true,
      },

      repositoryOwner: {
        type: String,
        default: "",
        trim: true,
      },

      defaultBranch: {
        type: String,
        default: "main",
        trim: true,
      },

      repositoryId: {
        type: Number,
        default: null,
      },

      lastSyncedAt: {
        type: Date,
        default: null,
      },

      syncStatus: {
        type: String,
        enum: [
          "not_connected",
          "syncing",
          "synced",
          "failed",
        ],
        default: "not_connected",
      },

      lastCommit: {
        sha: {
          type: String,
          default: "",
        },

        message: {
          type: String,
          default: "",
        },

        author: {
          type: String,
          default: "",
        },

        committedAt: {
          type: Date,
          default: null,
        },
      },

      fileCount: {
        type: Number,
        default: 0,
      },

      // ==========================================
      // AI ANALYSIS
      // ==========================================

      analysisStatus: {
        type: String,
        enum: [
          "not-analyzed",
          "analyzing",
          "completed",
          "failed",
        ],
        default: "not-analyzed",
      },

      lastAnalyzedAt: {
        type: Date,
        default: null,
      },

      analysis: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model(
  "Project",
  projectSchema
);

export default Project;
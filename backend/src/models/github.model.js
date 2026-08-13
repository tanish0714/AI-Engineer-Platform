import mongoose from "mongoose";

const githubConnectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    githubUserId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
    },

    displayName: {
      type: String,
      default: "",
      trim: true,
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    profileUrl: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    accessToken: {
      type: String,
      required: true,
      select: false,
    },

    tokenType: {
      type: String,
      default: "bearer",
    },

    connectedAt: {
      type: Date,
      default: Date.now,
    },

    lastSyncedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const GitHubConnection = mongoose.model(
  "GitHubConnection",
  githubConnectionSchema
);

export default GitHubConnection;
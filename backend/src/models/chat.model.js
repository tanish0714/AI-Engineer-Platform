import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    sources: {
      type: [
        {
          documentId: String,
          fileName: String,
          chunkIndex: Number,
        },
      ],
      default: [],
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const chatSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ project: 1, user: 1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
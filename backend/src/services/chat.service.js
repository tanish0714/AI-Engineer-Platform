import Chat from "../models/chat.model.js";
import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";

class ChatService {

  // =====================================================
  // GET PROJECT CHAT
  // =====================================================

  async getChat(projectId, userId) {

    const project = await Project.findOne({
      _id: projectId,
      owner: userId,
      status: "active",
    });

    if (!project) {
      throw new ApiError(
        404,
        "Project not found or you do not have access to it"
      );
    }

    let chat = await Chat.findOne({
      project: projectId,
      user: userId,
    });

    // Agar chat abhi exist nahi karti
    if (!chat) {
      chat = await Chat.create({
        project: projectId,
        user: userId,
        messages: [],
      });
    }

    return chat;
  }


  // =====================================================
  // ADD MESSAGE
  // =====================================================

  async addMessage(
    projectId,
    userId,
    role,
    content,
    sources = []
  ) {

    const project = await Project.findOne({
      _id: projectId,
      owner: userId,
      status: "active",
    });

    if (!project) {
      throw new ApiError(
        404,
        "Project not found or you do not have access to it"
      );
    }

    let chat = await Chat.findOne({
      project: projectId,
      user: userId,
    });

    if (!chat) {
      chat = await Chat.create({
        project: projectId,
        user: userId,
        messages: [],
      });
    }

    chat.messages.push({
      role,
      content,
      sources,
    });

    await chat.save();

    return chat;
  }


  // =====================================================
  // CLEAR CHAT
  // =====================================================

  async clearChat(projectId, userId) {

    const project = await Project.findOne({
      _id: projectId,
      owner: userId,
      status: "active",
    });

    if (!project) {
      throw new ApiError(
        404,
        "Project not found or you do not have access to it"
      );
    }

    const chat = await Chat.findOne({
      project: projectId,
      user: userId,
    });

    if (!chat) {
      return null;
    }

    chat.messages = [];

    await chat.save();

    return chat;
  }
}

export default new ChatService();
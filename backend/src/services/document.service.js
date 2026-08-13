import Document from "../models/document.model.js";
import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";

class DocumentService {

  // Get all documents of a project
  async getProjectDocuments(projectId, userId) {

    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Make sure project belongs to logged-in user
    if (project.owner.toString() !== userId.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    const documents = await Document.find({
      project: projectId,
      uploadedBy: userId,
    }).sort({ createdAt: -1 });

    return documents;
  }
}

export default new DocumentService();
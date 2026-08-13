import path from "path";
import axios from "axios";

import Document from "../models/document.model.js";
import Project from "../models/project.model.js";
import ApiError from "../utils/ApiError.js";

class UploadService {
  async uploadDocument(file, projectId, userId) {
    if (!file) {
      throw new ApiError(400, "No file uploaded");
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new ApiError(404, "Project not found");
    }
    console.log("========== OWNERSHIP DEBUG ==========");
console.log("Project ID:", project._id.toString());
console.log("Project Owner:", project.owner.toString());
console.log("Logged In User:", userId.toString());
console.log("=====================================");
    if (project.owner.toString() !== userId.toString()) {
      throw new ApiError(403, "Unauthorized");
    }

    // Create document
    const document = await Document.create({
      project: project._id,
      uploadedBy: userId,

      fileName: path.basename(file.path),
      originalName: file.originalname,

      fileType: file.mimetype,
      fileSize: file.size,

      storagePath: file.path,

      processingStatus: "pending",
    });

    // Automatically process document using AI Service
    try {
      console.log("Relative Path:", document.storagePath);
console.log("Absolute Path:", path.resolve(document.storagePath));
      const aiResponse = await axios.post(
        "http://127.0.0.1:8000/document/process",
        {
          file_path: path.resolve(document.storagePath),
          document_id: document._id.toString(),
          project_id: document.project.toString(),
          file_name: document.originalName,
        }
      );

      console.log("AI Processing Success:", aiResponse.data);

      document.processingStatus = "completed";
    } catch (error) {
  console.error("========== AI ERROR ==========");

  if (error.response) {
    console.error("Status:", error.response.status);
    console.error("Data:", error.response.data);
  } else {
    console.error(error);
  }

  document.processingStatus = "failed";
}

    await document.save();

    return document;
  }
}

export default new UploadService();
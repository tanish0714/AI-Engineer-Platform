import Project from "../models/project.model.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator.js";
import ApiError from "../utils/ApiError.js";

class ProjectService {
  /* -------------------- Create Project -------------------- */

  async createProject(projectData, userId) {
    const validatedData = createProjectSchema.parse(projectData);

    const project = await Project.create({
      ...validatedData,
      owner: userId,
    });

    return project;
  }

  /* -------------------- Get All Projects -------------------- */

  async getProjects(userId) {
    return await Project.find({
      owner: userId,
    }).sort({ createdAt: -1 });
  }

  /* -------------------- Get Single Project -------------------- */

  async getProjectById(projectId, userId) {
    const project = await Project.findOne({
      _id: projectId,
      owner: userId,
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return project;
  }

  /* -------------------- Update Project -------------------- */

  async updateProject(projectId, userId, updateData) {
    const validatedData = updateProjectSchema.parse(updateData);

    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        owner: userId,
      },
      validatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return project;
  }

  /* -------------------- Delete Project -------------------- */

  async deleteProject(projectId, userId) {
    const project = await Project.findOne({
      _id: projectId,
      owner: userId,
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Future:
    // Delete Chats
    // Delete Knowledge Base
    // Delete Documents
    // Delete AI Agents
    // Delete Embeddings
    // Delete GitHub Integration

    await project.deleteOne();

    return;
  }
}

export default new ProjectService();
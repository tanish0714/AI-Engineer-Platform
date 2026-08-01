import projectService from "../services/project.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/* -------------------- Create Project -------------------- */

export const createProject = asyncHandler(async (req, res) => {
  const project = await projectService.createProject(
    req.body,
    req.user._id
  );

  res.status(201).json(
    new ApiResponse(201, "Project created successfully", project)
  );
});

/* -------------------- Get All Projects -------------------- */

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectService.getProjects(req.user._id);

  res.status(200).json(
    new ApiResponse(200, "Projects fetched successfully", projects)
  );
});

/* -------------------- Get Single Project -------------------- */

export const getProject = asyncHandler(async (req, res) => {
  const project = await projectService.getProjectById(
    req.params.id,
    req.user._id
  );

  res.status(200).json(
    new ApiResponse(200, "Project fetched successfully", project)
  );
});

/* -------------------- Update Project -------------------- */

export const updateProject = asyncHandler(async (req, res) => {
  const project = await projectService.updateProject(
    req.params.id,
    req.user._id,
    req.body
  );

  res.status(200).json(
    new ApiResponse(200, "Project updated successfully", project)
  );
});

/* -------------------- Delete Project -------------------- */

export const deleteProject = asyncHandler(async (req, res) => {
  await projectService.deleteProject(
    req.params.id,
    req.user._id
  );

  res.status(200).json(
    new ApiResponse(200, "Project deleted successfully")
  );
});
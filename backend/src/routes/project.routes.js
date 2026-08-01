import { Router } from "express";

import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

/* -------------------- Protected Routes -------------------- */

router.use(authMiddleware);

// Create Project
router.post("/", createProject);

// Get All Projects
router.get("/", getProjects);

// Get Single Project
router.get("/:id", getProject);

// Update Project
router.patch("/:id", updateProject);

// Delete Project
router.delete("/:id", deleteProject);

export default router;
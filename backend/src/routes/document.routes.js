import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getProjectDocuments,
} from "../controllers/document.controller.js";

const router = Router();

// Protected
router.use(authMiddleware);

// GET project documents
router.get(
  "/project/:projectId",
  getProjectDocuments
);

export default router;
import { Router } from "express";

import {
  connectGitHub,
  githubCallback,
  getConnection,
  getRepositories,
  linkRepository,
  analyzeRepository,
  disconnectGitHub,
} from "../controllers/github.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// =====================================================
// OAUTH
// =====================================================

// Protected because we need current user identity
router.get(
  "/auth",
  authMiddleware,
  connectGitHub
);

// GitHub calls this directly.
// DO NOT protect this route with JWT.
router.get(
  "/callback",
  githubCallback
);

// =====================================================
// CONNECTION
// =====================================================

router.get(
  "/connection",
  authMiddleware,
  getConnection
);

// =====================================================
// REPOSITORIES
// =====================================================

router.get(
  "/repositories",
  authMiddleware,
  getRepositories
);

// =====================================================
// LINK
// =====================================================

router.post(
  "/link",
  authMiddleware,
  linkRepository
);

// =====================================================
// AI ANALYSIS
// =====================================================

router.post(
  "/analyze",
  authMiddleware,
  analyzeRepository
);

// =====================================================
// DISCONNECT
// =====================================================

router.delete(
  "/disconnect",
  authMiddleware,
  disconnectGitHub
);

export default router;
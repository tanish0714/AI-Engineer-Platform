import { Router } from "express";

import {
  signup,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

/* -------------------- Public Routes -------------------- */

router.post("/signup", signup);

router.post("/login", login);

/* -------------------- Protected Routes -------------------- */

router.post("/logout", authMiddleware, logout);

router.get("/me", authMiddleware, getCurrentUser);

export default router;
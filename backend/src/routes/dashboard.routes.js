import { Router } from "express";

import {
  getDashboard,
} from "../controllers/dashboard.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Protected Dashboard Routes
|--------------------------------------------------------------------------
*/

router.use(authMiddleware);

// GET /api/v1/dashboard
router.get("/", getDashboard);

export default router;
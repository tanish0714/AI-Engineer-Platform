import { Router } from "express";
import multer from "multer";

import {
  createInterview,
  startInterview,
  submitAnswer,
  submitVoiceAnswer,
  getProjectInterviews,
  getInterview,
} from "../controllers/interview.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

// =====================================================
// MULTER CONFIG
// =====================================================

const upload = multer({
  dest: "uploads/interviews/",

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "audio/webm",
      "audio/wav",
      "audio/wave",
      "audio/mpeg",
      "audio/mp4",
      "audio/ogg",
      "audio/x-wav",
      "audio/webm;codecs=opus",
    ];

    console.log("========== MULTER FILE ==========");
    console.log("Field:", file.fieldname);
    console.log("Original Name:", file.originalname);
    console.log("Mimetype:", file.mimetype);

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.log(
        "Rejected audio mimetype:",
        file.mimetype
      );

      cb(
        new Error(
          `Unsupported audio format: ${file.mimetype}`
        ),
        false
      );
    }
  },
});

// =====================================================
// CREATE INTERVIEW
// =====================================================

router.post(
  "/",
  authMiddleware,
  createInterview
);

// =====================================================
// START INTERVIEW
// =====================================================

router.post(
  "/:interviewId/start",
  authMiddleware,
  startInterview
);

// =====================================================
// SUBMIT TEXT ANSWER
// =====================================================

router.post(
  "/:interviewId/answer",
  authMiddleware,
  submitAnswer
);

// =====================================================
// SUBMIT VOICE ANSWER
// =====================================================

router.post(
  "/:interviewId/voice-answer",
  authMiddleware,
  upload.single("audio"),
  submitVoiceAnswer
);

// =====================================================
// GET PROJECT INTERVIEWS
// =====================================================

router.get(
  "/project/:projectId",
  authMiddleware,
  getProjectInterviews
);

// =====================================================
// GET SINGLE INTERVIEW
// =====================================================

router.get(
  "/:interviewId",
  authMiddleware,
  getInterview
);

export default router;
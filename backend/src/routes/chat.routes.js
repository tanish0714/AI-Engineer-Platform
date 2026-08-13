import { Router } from "express";
import mongoose from "mongoose";

import authMiddleware from "../middleware/auth.middleware.js";
import Project from "../models/project.model.js";

const router = Router();

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { question, project_id } = req.body;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!question?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    if (!project_id?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(project_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    // =====================================================
    // PROJECT OWNERSHIP
    // =====================================================

    const project = await Project.findOne({
      _id: project_id,
      owner: req.user._id,
      status: "active",
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or you do not have access to it",
      });
    }

    // =====================================================
    // AI SERVICE
    // =====================================================

    const response = await fetch(
      "http://127.0.0.1:8000/chat/pdf",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question: question.trim(),
          project_id: project._id.toString(),
        }),
      }
    );

    const data = await response.json();

    console.log("========== AI SERVICE RESPONSE ==========");
    console.log(data);
    console.log("=========================================");

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message:
          data.detail || "AI service request failed",
      });
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      answer: data.answer,
      sources: data.sources || [],
    });

  } catch (error) {
    console.error("AI CHAT ERROR:", error);
    next(error);
  }
});

export default router;
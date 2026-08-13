import interviewService from "../services/interview.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

// =====================================================
// CREATE INTERVIEW
// =====================================================

export const createInterview = asyncHandler(
  async (req, res) => {
    const {
      projectId,
      type,
      difficulty,
    } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Interview type is required",
      });
    }

    const interview =
      await interviewService.createInterview(
        projectId,
        req.user._id,
        type,
        difficulty
      );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Interview created successfully",
        interview
      )
    );
  }
);

// =====================================================
// START INTERVIEW
// =====================================================

export const startInterview = asyncHandler(
  async (req, res) => {
    const {
      interviewId,
    } = req.params;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    const interview =
      await interviewService.startInterview(
        interviewId,
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Interview started successfully",
        interview
      )
    );
  }
);

// =====================================================
// SUBMIT TEXT ANSWER
// =====================================================

export const submitAnswer = asyncHandler(
  async (req, res) => {
    const {
      interviewId,
    } = req.params;

    const {
      answer,
    } = req.body;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    if (
      !answer ||
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    const result =
      await interviewService.submitAnswer(
        interviewId,
        req.user._id,
        answer.trim()
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Answer evaluated successfully",
        result
      )
    );
  }
);

// =====================================================
// SUBMIT VOICE ANSWER
// =====================================================

export const submitVoiceAnswer = asyncHandler(
  async (req, res) => {
    console.log(
      "========== VOICE ANSWER CONTROLLER =========="
    );

    console.log(
      "Interview ID:",
      req.params.interviewId
    );

    console.log(
      "User ID:",
      req.user?._id
    );

    console.log(
      "Body:",
      req.body
    );

    console.log(
      "File:",
      req.file
    );

    // =================================================
    // VALIDATE INTERVIEW ID
    // =================================================

    if (!req.params.interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    // =================================================
    // VALIDATE USER
    // =================================================

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // =================================================
    // VALIDATE AUDIO FILE
    // =================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }

    // =================================================
    // AUDIO DETAILS
    // =================================================

    console.log(
      "========== AUDIO DETAILS =========="
    );

    console.log(
      "Field:",
      req.file.fieldname
    );

    console.log(
      "Original Name:",
      req.file.originalname
    );

    console.log(
      "Mimetype:",
      req.file.mimetype
    );

    console.log(
      "Path:",
      req.file.path
    );

    console.log(
      "Size:",
      req.file.size
    );

    console.log(
      "===================================="
    );

    // =================================================
    // SERVICE
    // =================================================

    const result =
      await interviewService.submitVoiceAnswer(
        req.params.interviewId,
        req.user._id,
        req.file
      );

    console.log(
      "VOICE ANSWER RESULT:",
      result
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json(
      new ApiResponse(
        200,
        "Voice answer evaluated successfully",
        result
      )
    );
  }
);

// =====================================================
// GET PROJECT INTERVIEWS
// =====================================================

export const getProjectInterviews =
  asyncHandler(async (req, res) => {
    const {
      projectId,
    } = req.params;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const interviews =
      await interviewService.getProjectInterviews(
        projectId,
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Interviews fetched successfully",
        interviews
      )
    );
  });

// =====================================================
// GET SINGLE INTERVIEW
// =====================================================

export const getInterview =
  asyncHandler(async (req, res) => {
    const {
      interviewId,
    } = req.params;

    if (!interviewId) {
      return res.status(400).json({
        success: false,
        message: "Interview ID is required",
      });
    }

    const interview =
      await interviewService.getInterview(
        interviewId,
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Interview fetched successfully",
        interview
      )
    );
  });
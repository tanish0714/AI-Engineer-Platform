import axios from "axios";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const chat = asyncHandler(async (req, res) => {
  const { question, project_id } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Question is required",
    });
  }

  if (!project_id) {
    return res.status(400).json({
      success: false,
      message: "Project ID is required",
    });
  }

  const response = await axios.post(
    "http://127.0.0.1:8000/chat/pdf",
    {
      question: question.trim(),
      project_id,
    }
  );

  return res.status(200).json(
    new ApiResponse(200, "AI response generated successfully", {
      answer: response.data.answer,
    })
  );
});
import uploadService from "../services/upload.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const uploadDocument = asyncHandler(async (req, res) => {
  const document = await uploadService.uploadDocument(
    req.file,
    req.body.projectId,
    req.user._id
  );

  res.status(201).json(
    new ApiResponse(
      201,
      "Document uploaded successfully",
      document
    )
  );
});
import documentService from "../services/document.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getProjectDocuments = asyncHandler(
  async (req, res) => {

    const documents =
      await documentService.getProjectDocuments(
        req.params.projectId,
        req.user._id
      );

    res.status(200).json(
      new ApiResponse(
        200,
        "Documents fetched successfully",
        documents
      )
    );
  }
);
import dashboardService from "../services/dashboard.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getDashboard = asyncHandler(
  async (req, res) => {
    const dashboard =
      await dashboardService.getDashboard(
        req.user._id
      );

    res.status(200).json(
      new ApiResponse(
        200,
        "Dashboard data fetched successfully",
        {
          user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar,
            role: req.user.role,
            isVerified: req.user.isVerified,
          },

          ...dashboard,
        }
      )
    );
  }
);
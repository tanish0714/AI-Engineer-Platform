import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
};

/* -------------------- Signup -------------------- */

export const signup = asyncHandler(async (req, res) => {
  const { user, token } = await authService.signup(req.body);

  res
    .status(201)
    .cookie("accessToken", token, cookieOptions)
    .json(
      new ApiResponse(201, "User registered successfully", {
        user,
      })
    );
});

/* -------------------- Login -------------------- */

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.login(req.body);

  res
    .status(200)
    .cookie("accessToken", token, cookieOptions)
    .json(
      new ApiResponse(200, "Login successful", {
        user,
      })
    );
});

/* -------------------- Logout -------------------- */

export const logout = asyncHandler(async (req, res) => {
  res
    .clearCookie("accessToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, "Logout successful"));
});

/* -------------------- Current User -------------------- */

export const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, "Current user fetched successfully", {
      user: req.user,
    })
  );
});
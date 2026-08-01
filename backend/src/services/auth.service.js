import User from "../models/user.model.js";
import { signupSchema, loginSchema } from "../validators/auth.validator.js";
import ApiError from "../utils/ApiError.js";

class AuthService {
  /* -------------------- Signup -------------------- */

  async signup(userData) {
    // Validate Request Body
    const validatedData = signupSchema.parse(userData);

    // Check Existing User
    const existingUser = await User.findOne({
      email: validatedData.email,
    });

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    // Create User
    const user = await User.create(validatedData);

    // Fetch user without password
    const createdUser = await User.findById(user._id).select("-password");

    // Generate JWT
    const token = user.generateAccessToken();

    return {
      user: createdUser,
      token,
    };
  }

  /* -------------------- Login -------------------- */

  async login(userData) {
    // Validate Request Body
    const validatedData = loginSchema.parse(userData);

    // Find User
    const user = await User.findOne({
      email: validatedData.email,
    }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Compare Password
    const isPasswordCorrect = await user.comparePassword(
      validatedData.password
    );

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate JWT
    const token = user.generateAccessToken();

    // Remove password before sending response
    const loggedInUser = await User.findById(user._id).select("-password");

    return {
      user: loggedInUser,
      token,
    };
  }
}

export default new AuthService();
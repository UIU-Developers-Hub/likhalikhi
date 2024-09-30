import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Assuming these are your token expiration times
const accessTokenExpiry = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const refreshTokenExpiry = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds

export const register = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    throw new ApiError(400, "Please fill all fields");
  }

  //check user already existed or not
  const exitedUser = await User.findOne({ email });
  if (exitedUser) {
    throw new ApiError(400, "User already existed with this email");
  }

  const user = await User.create({
    fullname,
    email,
    password,
    verificationToken: crypto.randomBytes(32).toString("hex"),
  });

  //check user created or not

  if (!user) {
    throw new ApiError(400, "Failed to create user");
  }

  //Send Verification mail

  await verificationEmail(user);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        null,
        "User created successfully. Please verify your email to activate your account."
      )
    );
});

const verificationEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Account Verification",
    text: `Please click the link below to verify your account ${process.env.CLIENT_URL}/verify-email?id=${user._id}&token=${user.verificationToken}`,
  };
  await transporter.sendMail(mailOptions);
};

// verify email

export const verifyEmail = async (req, res) => {
  console.log("verifyEmail is calling");

  const { token, id } = req.query; // Extract token and id from query parameters
  console.log(`Token received: ${token}`);
  console.log(`User ID received: ${id}`);

  try {
    // Find user by ID
    const user = await User.findById(id);
    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      console.log("User already verified");
      return res
        .status(200)
        .json({ success: true, message: "Email verified successfully" });
    }

    // Check if the verification token is valid and matches
    if (user.verificationToken && user.verificationToken === token) {
      // Verify the user and remove the token
      user.isVerified = true;
      user.verificationToken = undefined; // Removes the token
      await user.save();

      console.log("User verified and token removed");
      return res
        .status(200)
        .json({ success: true, message: "Email verified successfully" });
    } else {
      console.log("Invalid or expired token");
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }
  } catch (err) {
    console.log("Error occurred:", err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

const generateAccessAndRefreshTokens = async (userID) => {
  try {
    console.log("enter in try block");

    const user = await User.findById(userID);
    // console.log(user);
    const accessToken = await user.generateAccessToken();
    console.log(accessToken);
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate access and refresh token");
  }
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please fill all fields");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isMatch = await user.isPasswordCorrect(password);

  if (!isMatch) {
    throw new ApiError(400, "Incorrect password");
  }
  if (!user.isVerified) {
    await verificationEmail(user);
    console.log("Email not verified");
    throw new ApiError(
      401,
      "A email sent to your email Please verify your email to login"
    );
  }
  //all check are done avobe now we will generate access and refresh token

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select("-password ");
  // const options = {
  //   httpOnly: true,
  //   secure: true, // Ensure this is true in production
  //   sameSite: "lax", // or "strict" depending on your needs
  // };

  return res
    .status(200)
    .cookie("accessToken", accessToken, tokenOption(accessTokenExpiry))
    .cookie("refreshToken", refreshToken, tokenOption(refreshTokenExpiry))
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const tokenOption = (tokenExpiry) => {
  const options = {
    httpOnly: true,
    secure: true, // Ensure this is true in production
    sameSite: "none", // or "strict" depending on your needs
    maxAge: tokenExpiry, // Set cookie expiration
  };

  return options;
};

export const logout = asyncHandler(async (req, res) => {
  //todos
  //find user
  // Find the user by ID and remove the refresh token from their document
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Remove the refresh token from the database
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true, // Ensure this is true in production
    sameSite: "none", // or "strict" depending on your needs
  };

  return res
    .status(200)
    .clearCookie("accessToken", options) // Setting maxAge to 0 clears the cookie
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, { user: user }, "User logged out successfully"));
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  console.log("resendVerificationEmail is calling");
  // const { user } = req.body;
  const credentials = req.body;
  if (!credentials) {
    throw new ApiError(400, "Please provide a valid email address");
  }
  await verificationEmail(credentials);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Verification email resent. Please check your email."
      )
    );
});

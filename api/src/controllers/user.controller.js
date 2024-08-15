import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty, email format, password length
  // check if user exists
  //check for images , check for avater
  // upload them to cloudinary , avater
  //create user object - create entry in db
  //remove password and refresh token field from response
  // check for user creation
  // return response

  const { fullname, email, username, password } = req.body;
  console.log(fullname, email, username, password);
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // const avaterLocalPath = req.files?.avater[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // if (!avaterLocalPath) {
  //   throw new ApiError(400, "Avatar image is required");
  // }

  // const avater = await uploadOnCloudinary(avaterLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // if (!avater) {
  //   throw new ApiError(500, "Failed to upload Avater");
  // }

  // Check and handle file uploads
  let avater, coverImage;
  if (req.files && req.files.avater && req.files.avater[0]?.path) {
    avater = await uploadOnCloudinary(req.files.avater[0].path);
    if (!avater) {
      throw new ApiError(500, "Failed to upload Avatar");
    }
  } else {
    console.log(req.files.avater);
    throw new ApiError(400, "Avatar image is required");
  }

  if (req.files && req.files.coverImage && req.files.coverImage[0]?.path) {
    coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
  }

  const user = await User.create({
    fullname,
    email,
    username,
    password,
    avater: avater.url,
    coverImage: coverImage?.url || "",
  });

  // if (!user) {
  //   throw new ApiError(500, "Failed to create user");
  // }
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createUser, "User created successfully"));
});

const generateAccessAndRefreshTokens = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate access and refresh token");
  }
};

const loginUser = asyncHandler(async (req, res) => {
  //todos
  // get email or username and password from frontend => req.body
  // find the user
  // password check
  // generate access and refresh token
  // send cookies with access and refresh token

  const { email, username, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, "Email or Username is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  //todos
  //find user
  //remove refresh and access token

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("access_token", options)
    .clearCookie("refresh_token", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refresh_token || req.body.refresh_token;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("access_token", accessToken, options)
      .cookie("refresh_token", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { loginUser, logoutUser, refreshAccessToken, registerUser };

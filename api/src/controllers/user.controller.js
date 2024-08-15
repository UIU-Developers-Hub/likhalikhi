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

export { registerUser };

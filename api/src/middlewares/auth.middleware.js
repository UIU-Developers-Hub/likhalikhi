import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers["Authorization"]?.replace("bearer ", "");

    console.log("token:", token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid access token");
  }
});

// here maybe we doo not need asyncHandler and also , this is a verifyJWT method
// which will verify the token and also attach the user to the request object
// so that we can access the user in the controller methods and if access token is expired
// then we will verify the refresh token and generate a new access token .
export const verifyJWT2 = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.headers["authorization"]?.replace("bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    try {
      // Verify the access token
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      req.user = user;
      next();
    } catch (error) {
      // Check if the error is due to token expiration
      if (error.name === "TokenExpiredError") {
        // Handle the token expiration by verifying the refresh token
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
          throw new ApiError(
            401,
            "Refresh token not found, please login again"
          );
        }

        try {
          const decodedRefreshToken = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
          );
          const user = await User.findById(decodedRefreshToken._id);

          if (!user) {
            throw new ApiError(404, "User not found");
          }

          // Generate a new access token
          const newAccessToken = user.generateAccessToken();

          // Optionally, send the new access token as a cookie or in the response body
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          // Attach the user to the request object
          req.user = user;
          next();
        } catch (refreshError) {
          throw new ApiError(
            401,
            "Invalid or expired refresh token, please login again"
          );
        }
      } else {
        throw new ApiError(401, error?.message || "Invalid access token");
      }
    }
  } catch (error) {
    next(error);
  }
});

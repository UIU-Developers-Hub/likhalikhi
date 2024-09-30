import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "password is required"] },
    profilePic: { type: String }, // cloudinary URL
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

//Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//creating custom method [we named it "isPasswordCorrect"]
userSchema.methods.isPasswordCorrect = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  } catch (error) {
    console.error("Error generating access token:", error);
    throw new ApiError(500, "Failed to generate access token");
  }
};

userSchema.methods.generateRefreshToken = function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw new ApiError(500, "Failed to generate refresh token");
  }
};

const User = mongoose.model("User", userSchema);
export default User;

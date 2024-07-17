import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      min: [3, 'Username must be at least 3, got {VALUE}'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    isActive: {
      type: String,
      required: [true, 'Password is required'], //for custom message
    },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);

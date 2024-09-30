import express from "express";
import {
  login,
  logout,
  register,
  resendVerificationEmail,
  verifyEmail,
} from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyJWT, logout);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);

export default router;

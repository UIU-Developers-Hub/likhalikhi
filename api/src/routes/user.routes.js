import express from "express";
import { getUserProfile, updateUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/:userId", getUserProfile);
router.put("/:userId", verifyJWT, upload.single("profilePic"), updateUser);
// router.put("/:userId", verifyJWT, upload.single("profilePic"), updateUser);

export default router;

import express from "express";
import {
  register,
  login,
  forgotPassword,
  updatePassword,
} from "../controllers/authController.js";
import authenticateToken from "../middleware/authMiddleware.js";
import { getGoogleUrl, googleCallback } from "../controllers/googleAuthController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/auth/update-password", authenticateToken, updatePassword);
router.get('/google/url',         getGoogleUrl);     
router.post('/google/callback',   googleCallback);    

export default router;

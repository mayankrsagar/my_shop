import express from "express";
import rateLimit from "express-rate-limit";

import { getMe, login, logout, signup } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import {
  handleValidationErrors,
  validateLogin,
  validateSignup,
} from "../middleware/validation.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: "Too many authentication attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/signup",
  authLimiter,
  validateSignup,
  handleValidationErrors,
  signup
);
router.post(
  "/login",
  authLimiter,
  validateLogin,
  handleValidationErrors,
  login
);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

export default router;

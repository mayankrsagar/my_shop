import express from 'express';
import { body } from 'express-validator';

import {
  requestPasswordReset,
  resetPassword,
} from '../controllers/passwordResetController.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Request password reset
router.post(
  "/request",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
  ],
  handleValidationErrors,
  requestPasswordReset
);

// Reset password
router.post(
  "/reset",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      )
      .withMessage(
        "Password must contain uppercase, lowercase, number, and special character"
      ),
  ],
  handleValidationErrors,
  resetPassword
);

export default router;

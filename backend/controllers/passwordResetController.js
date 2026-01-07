import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Always return same response to prevent user enumeration
    const standardResponse = {
      message: "If an account with that email exists, we've sent a password reset link."
    };

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (user) {
      // Generate secure random token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Delete any existing reset tokens for this user
      await PasswordReset.deleteMany({ userId: user._id });

      // Create new reset token
      await PasswordReset.create({
        userId: user._id,
        token: hashedToken
      });

      // In production, send email here
      console.log(`Password reset link: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`);
      
      // TODO: Send email with reset link
      // await sendPasswordResetEmail(user.email, resetToken);
    }

    // Always return same response regardless of whether email exists
    res.json(standardResponse);
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid, unused token
    const resetRecord = await PasswordReset.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: new Date() }
    }).populate('userId');

    if (!resetRecord) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await User.findByIdAndUpdate(resetRecord.userId._id, {
      password: hashedPassword
    });

    // Mark token as used
    await PasswordReset.findByIdAndUpdate(resetRecord._id, { used: true });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
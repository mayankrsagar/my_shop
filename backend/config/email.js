import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Add this after dotenv.config()
const requiredEnvVars = [
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
  "EMAIL_FROM",
  "FRONTEND_URL",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});
// Email transporter configuration - uses environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter on startup
transporter
  .verify()
  .then(() => {
    console.log("✅ Email server is ready to take our messages");
  })
  .catch((error) => {
    console.error("❌ Error verifying email server:", error);
  });

/**
 * Send password reset email
 * @param {string} to - Recipient email address
 * @param {string} token - Password reset token
 */
export const sendPasswordResetEmail = async (to, token) => {
  // Handle potentially comma-separated FRONTEND_URL and pick the first one.
  const frontendUrl = process.env.FRONTEND_URL.split(",")[0].trim();
  const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"BuyBloom" <${process.env.EMAIL_FROM}>`, // Sender address from env
    to: to,
    subject: "Password Reset Request for Your BuyBloom Account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Password Reset Request</h2>
        <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the button below to reset your password:</p>
        <a href="${resetUrl}" style="background-color: #8a2be2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Reset Password</a>
        <p><strong>This password reset link will expire in 1 hour.</strong></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr/>
        <p>Thanks,<br/>The BuyBloom Team</p>
      </div>
    `,
    text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.

Please copy and paste the following URL into your browser to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you did not request this, please ignore this email and your password will remain unchanged.

Thanks,
The BuyBloom Team
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Password reset email sent to: ${to}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error(
      "Could not send password reset email. Please try again later."
    );
  }
};

export default transporter;

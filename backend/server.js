import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

import connectDB from './config/database.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/payment.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import passwordResetRoutes from './routes/passwordResetRoutes.js';

const app = express();

// Security and Parsers
app.use(helmet());

dotenv.config();

const allowedOrigins = process.env.FRONTEND_URL.split(",");

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", categoryRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api", favoritesRoutes);
app.use("/api/password", passwordResetRoutes);

// --- GLOBAL ERROR HANDLER ---
// This must be the LAST middleware added to the app
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error]: ${message}`, err.stack); // Useful for debugging

  res.status(statusCode).json({
    success: false,
    error: message,
    details: err.details || null,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import "dotenv/config";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import paymentRoutes from "./routes/payment.js";

const app = express();

// Security and Parsers
app.use(helmet());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
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

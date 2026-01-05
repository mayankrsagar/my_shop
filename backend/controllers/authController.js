import jwt from "jsonwebtoken";

import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "7d",
  });
};

// Set cookie helper to keep code DRY
const sendTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const signup = async (req, res, next) => {
  // Added next
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user exists manually (Good practice)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      return next(error);
    }

    // 2. Create User
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    // 3. Catch Mongoose Specific Errors (like duplicate key 11000)
    if (err.code === 11000) {
      err.message = "Email already registered";
      err.statusCode = 400;
    }
    next(err); // This sends the error to your server.js error handler
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    const token = generateToken(user._id);
    sendTokenCookie(res, token);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { maxAge: 1 });
  res.json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req, res, next) => {
  try {
    // req.user is populated by your 'authenticate' middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

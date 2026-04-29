// controllers/authController.ts
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/db.js";
import { supabase } from "../lib/supbase.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret";

// ── Validation helpers ────────────────────────────────────────────────────────
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidPassword = (password: string) => password.length >= 8;

// ── Register ──────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // Validate all fields before touching the DB
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }
  if (!isValidPassword(password)) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters." });
  }
  if (name && name.trim().length < 2) {
    return res
      .status(400)
      .json({ message: "Name must be at least 2 characters." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        name: name?.trim(),
      },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ message: "An account with this email already exists." });
    }
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Same message for "user not found" and "wrong password" — avoids
    // leaking whether an email is registered or not (security best practice)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ── Forgot Password ───────────────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: "SmartStudyScheduler://reset-password",
      },
    );

    if (error) throw error;

    res.status(200).json({ message: "Password reset email sent!" });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    res
      .status(500)
      .json({ message: "Error sending reset email.", error: error.message });
  }
};

// ── Update Password ───────────────────────────────────────────────────────────
export const updatePassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const userId = (req as any).user?.userId;

  if (!password) {
    return res.status(400).json({ message: "New password is required." });
  }
  if (!isValidPassword(password)) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters." });
  }
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ message: "Failed to update password." });
  }
};

export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided." });
  }

  try {
    // Verify it's a valid token first
    jwt.verify(token, JWT_SECRET);

    // Stateless JWT logout: client should discard the token.
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error: any) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed." });
  }
};

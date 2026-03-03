// controllers/authController.ts
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/db.js';
import { supabase } from '../lib/supbase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

// ── Register ──────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    // ✅ Return a token just like login does — frontend expects { token }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered!',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    // Prisma unique constraint error code
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// ── Forgot Password ───────────────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'SmartStudyScheduler://reset-password',
    });

    if (error) throw error;

    res.status(200).json({ message: 'Password reset email sent!' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error sending reset email.', error: error.message });
  }
};

// ── Update Password ───────────────────────────────────────────────────────────
export const updatePassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  // JWT middleware should attach userId to req — adjust to match your middleware
  const userId = (req as any).user?.userId;

  if (!password) {
    return res.status(400).json({ message: 'New password is required.' });
  }

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Failed to update password.' });
  }
};
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/db.js'; // Note the .js for ESM!
import { supabase } from '../lib/supbase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    // 1. Hash the password so it's not plain text in Supabase
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Create the user in your manual 'User' table
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    res.status(201).json({ message: "User registered!", userId: user.id });
  } catch (error: any) {
    res.status(400).json({ error: "Registration failed. Email might already exist." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 2. Compare the plain password with the hashed one in the DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Generate a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // 4. Send the token back to the user
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Trigger the Supabase password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'SmartStudyScheduler://forgot-password', // Configure this for your app
    });

    if (error) throw error;

    res.status(200).json({ message: "Password reset email sent!" });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Error sending reset email", error: error.message });
  }
};
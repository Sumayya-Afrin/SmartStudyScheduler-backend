import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../lib/db.js';
import { supabase } from '../lib/supbase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

// GET /auth/google/url
export const getGoogleUrl = async (req: Request, res: Response) => {
  const { redirectTo } = req.query;
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: (redirectTo as string) || `${process.env.FRONTEND_URL}/auth/callback`,
        skipBrowserRedirect: true,
      },
    });
    if (error || !data?.url) throw new Error(error?.message || 'Could not generate URL');
    res.status(200).json({ url: data.url });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to generate Google login URL.' });
  }
};

// POST /auth/google/callback
export const googleCallback = async (req: Request, res: Response) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ message: 'Access token is required.' });
  try {
    const { data, error } = await supabase.auth.getUser(access_token);
    if (error || !data.user) return res.status(401).json({ message: 'Invalid Google token.' });

    const { email, user_metadata } = data.user;
    const name = user_metadata?.full_name || user_metadata?.name || '';
    if (!email) return res.status(400).json({ message: 'No email from Google.' });

    const user = await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: { name: name || undefined },
      create: { email: email.toLowerCase(), name, password: '' },
    });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Google login successful!', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ message: 'Google authentication failed.' });
  }
};
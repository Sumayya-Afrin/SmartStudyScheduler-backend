import express from 'express';
import { register, login } from '../controllers/authController.js';
import { supabase } from '../lib/supbase.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://yourapp.com/reset-password',
    });
    if (error) throw error;
    res.status(200).json({ message: "Reset email sent!" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ error: errorMessage });
  }
});

export default router;
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // Note the .js extension! (ESM requirement)
import { authenticateToken } from './middleware/authMiddleware.js';
import taskRoutes from './routes/taskRoutes.js';


dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// This route is protected!
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({ message: "Welcome to your private profile!", user: (req as any).user });
});

app.get('/', (req, res) => {
  res.send('Smart Study Scheduler API is Running! 🚀');
});


// ... other middleware
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is sprinting on port ${PORT}`);
});
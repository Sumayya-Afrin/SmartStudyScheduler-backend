import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // 1. Import cors
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();

// 2. Configure CORS to allow your frontend
app.use(cors({
  origin: 'http://localhost:8081', // Your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Protected profile route
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({ message: "Welcome to your private profile!", user: (req as any).user });
});

app.get('/', (req, res) => {
  res.send('Smart Study Scheduler API is Running! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is sprinting on port ${PORT}`);
});
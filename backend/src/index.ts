import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; // Note the .js extension! (ESM requirement)

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Smart Study Scheduler API is Running! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is sprinting on port ${PORT}`);
});
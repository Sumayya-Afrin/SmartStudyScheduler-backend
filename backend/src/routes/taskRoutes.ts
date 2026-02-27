import { Router } from 'express';
import { createTask, getTasks, deleteTask } from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Protect all routes in this file
router.use(authenticateToken);

router.get('/', getTasks);        // GET /api/tasks
router.post('/', createTask);     // POST /api/tasks
router.delete('/:id', deleteTask); // DELETE /api/tasks/1

export default router;
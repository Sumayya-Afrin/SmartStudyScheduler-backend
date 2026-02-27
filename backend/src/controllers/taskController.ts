import type { Request, Response } from 'express';
import prisma from '../lib/db.js';

// CREATE: Add a new study task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, startTime, endTime, priority } = req.body;
    // Ensure 'user' is correctly attached to the request by your auth middleware
    const userId = (req as any).user?.userId; 

    if (!userId) return res.status(401).json({ message: "User not authenticated" });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        priority: priority || 'medium',
        userId: userId, // This links the task to the User
      },
    });

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// READ: Get all tasks for the logged-in user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    const tasks = await prisma.task.findMany({
      where: { userId: userId },
      orderBy: { startTime: 'asc' },
    });

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// DELETE: Remove a task by its ID
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Expecting a string UUID
    
    await prisma.task.delete({
      where: { id: Number(id) }, // Use string if ID is UUID, or Number(id) if ID is auto-increment
    });
    
    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};
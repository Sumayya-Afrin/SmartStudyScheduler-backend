import type { Request, Response } from 'express';
import prisma from '../lib/db.js';

// CREATE a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, startTime, endTime, priority } = req.body;
    const userId = (req as any).user.userId; // Extracted from JWT token by middleware

    const task = await prisma.task.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        priority: priority || 'medium',
        userId: userId,
      },
    });

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// GET all tasks for the logged-in user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const tasks = await prisma.task.findMany({
      where: { userId: userId },
      orderBy: { startTime: 'asc' },
    });

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// DELETE a task
export const deleteTask = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.task.delete({
        where: { id: Number(id) },
      });
      res.json({ message: "Task deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting task" });
    }
};


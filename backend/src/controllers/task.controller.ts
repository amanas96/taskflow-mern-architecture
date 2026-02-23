import { type Request, type Response } from "express";
import { prisma } from "../lib/prisma.js";
import { Status, type Prisma } from "@prisma/client";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = String(req.user!.userId);

    // Parse query parameters safely
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Validate pagination limits (prevent abuse)
    const validatedLimit = Math.min(Math.max(limit, 1), 100); // Max 100 items per page
    const validatedPage = Math.max(page, 1);
    const skip = (validatedPage - 1) * validatedLimit;

    // Build where clause
    const where: Prisma.TaskWhereInput = {
      userId,
    };

    // ✅ Validate status is a valid enum value
    if (status && Object.values(Status).includes(status as Status)) {
      where.status = status as Status;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: validatedLimit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where }),
    ]);

    res.json({
      tasks,
      pagination: {
        total,
        page: validatedPage,
        limit: validatedLimit,
        pages: Math.ceil(total / validatedLimit),
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = String(req.user!.userId);

    const task = await prisma.task.create({
      data: { title, description, userId },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { title, description, status } = req.body;
    const userId = String(req.user!.userId);

    const data: Prisma.TaskUpdateInput = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (status !== undefined) data.status = status;

    const task = await prisma.task.updateMany({
      where: { id, userId }, // Security: Only update if user owns the task
      data,
    });

    if (task.count === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const userId = String(req.user!.userId);

    const task = await prisma.task.deleteMany({
      where: { id, userId }, // Security: Only delete if user owns the task
    });

    if (task.count === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

import { Request, Response } from "express";

let users: string[] = ["John", "Jane"];

export const getUsers = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: users,
  });
};

export const createUser = (req: Request, res: Response): void => {
  const { name } = req.body as { name?: string };

  if (!name) {
    res.status(400).json({
      success: false,
      message: "Name is required",
    });
    return;
  }

  users.push(name);

  res.status(201).json({
    success: true,
    message: "User created",
    data: users,
  });
};
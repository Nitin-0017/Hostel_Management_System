import { Router, Request, Response } from "express";

const healthRouter = Router();

healthRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy 🚀",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default healthRouter;
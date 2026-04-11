import { Router } from "express";
import userRouter from "./user.routes";
import healthRouter from "./health.routes";
import authRouter from "./auth.routes";

const router = Router();

/**
 * Auth Routes - Priority: First (public routes)
 */
router.use("/auth", authRouter);

/**
 * User Routes
 */
router.use("/users", userRouter);

/**
 * Health Routes
 */
router.use("/health", healthRouter);

export default router;
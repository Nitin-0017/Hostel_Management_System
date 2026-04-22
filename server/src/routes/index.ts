import { Router } from "express";
import userRouter from "./user.routes";
import healthRouter from "./health.routes";
import studentRouter from "./student.routes";
import staffRouter from "./staff.routes";
import adminRouter from "./admin.routes";

const router = Router();

router.use("/users", userRouter);
router.use("/health", healthRouter);
router.use("/student", studentRouter);
router.use("/staff", staffRouter);
router.use("/admin", adminRouter);

export default router;
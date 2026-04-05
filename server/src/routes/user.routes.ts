import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { adminLogin, getMe, staffLogin, staffSignup, studentLogin, studentSignup } from "../controllers/user.controller";

const userRouter = Router();

// Student
userRouter.post("/student/signup", studentSignup);
userRouter.post("/student/login",  studentLogin);
 
// Staff
userRouter.post("/staff/signup", staffSignup);
userRouter.post("/staff/login",  staffLogin);
 
// Admin
userRouter.post("/admin/login", adminLogin);
 
// Protected route
userRouter.get("/me", verifyToken, getMe);

export default userRouter;
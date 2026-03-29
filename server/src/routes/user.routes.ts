import { Router } from "express";
import { getUsers, createUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.post("/", createUser);

export default userRouter;
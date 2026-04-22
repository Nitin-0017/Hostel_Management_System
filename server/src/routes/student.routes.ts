import { Router } from "express";
import { verifyToken, requireRole } from "../middleware/authMiddleware";
import { getMyProfile, updateMyProfile } from "../controllers/student.controller";
import { getMyRoom } from "../controllers/room.controller";
import { submitComplaint, getMyComplaints } from "../controllers/complaint.controller";
import { applyLeave, getMyLeaves, cancelLeave } from "../controllers/leave.controller";
import { requestCleaning, getMyCleaning } from "../controllers/cleaning.controller";
import { getMyNotifications, markRead, markAllRead } from "../controllers/notification.controller";

const router = Router();
router.use(verifyToken, requireRole("STUDENT"));

router.get("/profile", getMyProfile);
router.put("/profile", updateMyProfile);
router.get("/room", getMyRoom);

router.post("/complaints", submitComplaint);
router.get("/complaints", getMyComplaints);

router.post("/leaves", applyLeave);
router.get("/leaves", getMyLeaves);
router.patch("/leaves/:id/cancel", cancelLeave);

router.post("/cleaning", requestCleaning);
router.get("/cleaning", getMyCleaning);

router.get("/notifications", getMyNotifications);
router.patch("/notifications/:id/read", markRead);
router.patch("/notifications/read-all", markAllRead);

export default router;

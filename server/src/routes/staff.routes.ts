import { Router } from "express";
import { verifyToken, requireRole } from "../middleware/authMiddleware";
import { getAssignedRooms } from "../controllers/staff.controller";
import { getStaffCleaning, updateCleaningStatus } from "../controllers/cleaning.controller";
import { getMyNotifications, markRead, markAllRead } from "../controllers/notification.controller";

const router = Router();
router.use(verifyToken, requireRole("STAFF"));

router.get("/rooms", getAssignedRooms);

router.get("/cleaning", getStaffCleaning);
router.patch("/cleaning/:id/status", updateCleaningStatus);

router.get("/notifications", getMyNotifications);
router.patch("/notifications/:id/read", markRead);
router.patch("/notifications/read-all", markAllRead);

export default router;

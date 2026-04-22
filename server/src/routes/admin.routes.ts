import { Router } from "express";
import { verifyToken, requireRole } from "../middleware/authMiddleware";
import { getAllStudents, getStudentById, updateStudent, removeStudent, generateOccupancyReport, generateComplaintReport, generateLeaveReport, getReports } from "../controllers/admin.controller";
import { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom, getAvailableRooms, allocateRoom, deallocateRoom } from "../controllers/room.controller";
import { getAllComplaints, getComplaintById, resolveComplaint, rejectComplaint, markComplaintInProgress } from "../controllers/complaint.controller";
import { getAllLeaves, approveLeave, rejectLeave } from "../controllers/leave.controller";
import { getAllCleaning, assignCleaning } from "../controllers/cleaning.controller";
import { sendNotification } from "../controllers/notification.controller";

const router = Router();
router.use(verifyToken, requireRole("ADMIN"));

// Students
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", removeStudent);

// Rooms
router.post("/rooms", createRoom);
router.get("/rooms", getAllRooms);
router.get("/rooms/available", getAvailableRooms);
router.get("/rooms/:id", getRoomById);
router.put("/rooms/:id", updateRoom);
router.delete("/rooms/:id", deleteRoom);
router.post("/rooms/allocate", allocateRoom);
router.post("/rooms/deallocate", deallocateRoom);

// Complaints
router.get("/complaints", getAllComplaints);
router.get("/complaints/:id", getComplaintById);
router.patch("/complaints/:id/in-progress", markComplaintInProgress);
router.patch("/complaints/:id/resolve", resolveComplaint);
router.patch("/complaints/:id/reject", rejectComplaint);

// Leaves
router.get("/leaves", getAllLeaves);
router.patch("/leaves/:id/approve", approveLeave);
router.patch("/leaves/:id/reject", rejectLeave);

// Cleaning
router.get("/cleaning", getAllCleaning);
router.patch("/cleaning/:id/assign", assignCleaning);

// Notifications
router.post("/notifications", sendNotification);

// Reports
router.get("/reports", getReports);
router.post("/reports/occupancy", generateOccupancyReport);
router.post("/reports/complaints", generateComplaintReport);
router.post("/reports/leaves", generateLeaveReport);

export default router;

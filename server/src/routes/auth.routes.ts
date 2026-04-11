import { Router } from "express";
import {
  login,
  studentSignup,
  adminSignup,
  staffSignup,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/authMiddleware";

/**
 * Authentication Routes
 * Design Pattern: Route Handler Pattern
 *
 * Endpoints:
 * POST   /api/auth/login           - User login
 * POST   /api/auth/student/signup  - Student registration
 * POST   /api/auth/staff/signup    - Staff registration (admin only)
 * GET    /api/auth/me              - Get current user
 * POST   /api/auth/logout          - Logout user
 */

const router = Router();

/**
 * ── Public Routes ──────────────────────────────
 */

/**
 * Login
 * POST /api/auth/login
 *
 * Request Body:
 * {
 *   "email": "student@example.com",
 *   "password": "password123"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "token": "eyJhbGc...",
 *   "refreshToken": "eyJhbGc...",
 *   "user": {
 *     "id": "uuid",
 *     "email": "student@example.com",
 *     "firstName": "John",
 *     "lastName": "Doe",
 *     "role": "STUDENT",
 *     "isActive": true
 *   }
 * }
 */
router.post("/login", login);

/**
 * Student Signup
 * POST /api/auth/student/signup
 *
 * Request Body:
 * {
 *   "email": "student@example.com",
 *   "password": "password123",
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "enrollmentNumber": "2024001",
 *   "course": "Computer Science",
 *   "year": 2
 * }
 */
router.post("/student/signup", studentSignup);

/**
 * Admin Signup
 * POST /api/auth/admin/signup
 *
 * Request Body:
 * {
 *   "email": "admin@example.com",
 *   "password": "password123",
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "phone": "1234567890"
 * }
 */
router.post("/admin/signup", adminSignup);

/**
 * Staff Signup
 * POST /api/auth/staff/signup
 */
router.post("/staff/signup", staffSignup);

/**
 * ── Protected Routes ───────────────────────────
 * Design Pattern: Middleware Pattern
 * All routes below require valid JWT token
 */

/**
 * Get Current User
 * GET /api/auth/me
 *
 * Headers:
 * Authorization: Bearer <token>
 */
router.get("/me", verifyToken, getCurrentUser);

/**
 * Logout
 * POST /api/auth/logout
 *
 * Headers:
 * Authorization: Bearer <token>
 */
router.post("/logout", verifyToken, logout);

export default router;

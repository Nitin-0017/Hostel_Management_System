<h1 align="center">🏨 HostelHub — Smart Hostel Management System</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white&style=flat-square" />
</p>

<p align="center">
  A full-stack, role-based hostel management web application built for the <strong>System Design & Software Engineering (SDSE)</strong> course.
  It automates room allocation, fee tracking, complaint handling, leave requests, cleaning scheduling, and staff management through a clean, layered architecture.
</p>

---

## 📑 Table of Contents

1. [Problem Statement](#-problem-statement)
2. [Live Demo](#-live-demo)
3. [Tech Stack](#-tech-stack)
4. [System Architecture](#-system-architecture)
5. [Folder Structure](#-folder-structure)
6. [Database Schema (ER Diagram)](#-database-schema-er-diagram)
7. [OOP Concepts Applied](#-oop-concepts-applied)
8. [Design Patterns](#-design-patterns)
9. [SOLID Principles](#-solid-principles)
10. [API Reference](#-api-reference)
11. [Features by Role](#-features-by-role)
12. [Getting Started](#-getting-started)
13. [Environment Variables](#-environment-variables)
14. [Team](#-team)

---

## 🎯 Problem Statement

Managing hostel operations manually is time-consuming and error-prone. Wardens struggle with room allocation, complaint tracking, and maintaining student records. Small hostels lack a unified digital platform.

**HostelHub** solves this by providing a centralized, role-based web application that automates:

- Room allocation & tracking
- Student fee management
- Complaint & leave request workflows
- Cleaning schedule coordination
- Admin reporting & staff management

---

## 🌐 Live Demo

| Service  | URL |
|----------|-----|
| Frontend | [hostell-hubb.vercel.app](https://hostell-hubb.vercel.app) |
| Backend  | [hostel-management-system-vjbq.onrender.com](https://hostel-management-system-vjbq.onrender.com) |

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + TypeScript + Vite | SPA with role-based routing |
| **Styling** | Vanilla CSS + CSS Variables | Custom design system, no framework |
| **HTTP Client** | Axios | API communication with interceptors |
| **Charts** | Recharts | Dashboard data visualization |
| **Backend** | Node.js + Express 5 | RESTful API server |
| **ORM** | Prisma 6 | Type-safe database access |
| **Database** | MySQL | Relational data storage |
| **Auth** | JWT + bcryptjs | Stateless authentication |
| **Validation** | Zod | Schema-based input validation |
| **Dev Tools** | ts-node-dev, ESLint | Hot-reload, linting |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Vite + React)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │  Pages   │  │ Components│  │  Hooks   │  │Services│  │
│  │ (by role)│  │ (Shared) │  │(useDash) │  │(Axios) │  │
│  └────┬─────┘  └──────────┘  └────┬─────┘  └───┬────┘  │
│       └────────────────────────────┴────────────┘       │
│                      Axios API Client                    │
│              (JWT interceptor, auth redirect)            │
└────────────────────────────┬────────────────────────────┘
                             │ HTTPS / REST
┌────────────────────────────▼────────────────────────────┐
│                  SERVER (Express 5 + TypeScript)         │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐             │
│  │  Routes  │→ │Controllers│→ │ Services │             │
│  │ /api/... │  │(req/res)  │  │(Business │             │
│  └──────────┘  └───────────┘  │  Logic)  │             │
│                               └────┬─────┘             │
│  ┌──────────────┐  ┌──────────┐    │                    │
│  │ authMiddleware│  │Validators│    │                    │
│  │ (JWT + Role) │  │  (Zod)   │    │                    │
│  └──────────────┘  └──────────┘    │                    │
└────────────────────────────────────┼────────────────────┘
                                     │ Prisma ORM
┌────────────────────────────────────▼────────────────────┐
│                     MySQL Database                       │
│  users · students · staff · admins · rooms              │
│  room_allocations · fee_records · complaints            │
│  leave_requests · cleaning_requests · notifications     │
│  reports · staff_room_assignments                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
Hostel_Management_System/
├── client/                          # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── dashboard/           # StatCard, Card, Button, Icon
│   │   │   ├── layout/              # DashboardLayout, Sidebar, Navbar
│   │   │   ├── modals/              # SubmitComplaintModal, RequestCleaningModal
│   │   │   ├── ui/                  # Skeleton loader, shared elements
│   │   │   └── ProtectedRoute.tsx   # Role-based route guard
│   │   ├── config/
│   │   │   └── apiClient.ts         # Axios instance + JWT + redirect interceptors
│   │   ├── context/
│   │   │   ├── AuthContext.tsx      # Global auth state
│   │   │   └── ToastContext.tsx     # Global toast notifications
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           # Auth context consumer
│   │   │   ├── useDashboard.ts      # Student dashboard data fetcher
│   │   │   └── useRoomData.ts       # Room + complaints + cleaning fetcher
│   │   ├── pages/
│   │   │   ├── Landing/             # Public landing page
│   │   │   ├── Login/               # Unified login (Admin / Student / Staff)
│   │   │   ├── Signup/              # Student & Staff signup
│   │   │   ├── Dashboard/           # AdminDashboard, StudentDashboard, StaffDashboard
│   │   │   │   ├── AdminStudents.tsx
│   │   │   │   ├── AdminRooms.tsx
│   │   │   │   ├── AdminComplaints.tsx
│   │   │   │   ├── AdminLeave.tsx
│   │   │   │   ├── AdminStaff.tsx
│   │   │   │   ├── AdminCleaning.tsx
│   │   │   │   └── AdminAnnouncements.tsx
│   │   │   ├── MyRoom/              # Student room view + sub-components
│   │   │   ├── Complaints/          # Student complaint management
│   │   │   ├── Fees/                # Student fee records & summary
│   │   │   ├── Leave/               # Student leave applications
│   │   │   ├── Staff/               # Staff portal (Rooms, Cleaning, Profile)
│   │   │   ├── Profile/             # User profile & settings
│   │   │   └── Support/             # Help & support page
│   │   ├── services/                # Axios API wrappers per domain
│   │   │   ├── authService.ts
│   │   │   ├── roomService.ts
│   │   │   ├── feeService.ts
│   │   │   ├── complaintService.ts
│   │   │   ├── leaveService.ts
│   │   │   ├── cleaningService.ts
│   │   │   ├── notificationService.ts
│   │   │   ├── adminService.ts
│   │   │   ├── staffService.ts
│   │   │   └── studentService.ts
│   │   ├── styles/                  # Global design tokens & CSS
│   │   ├── types/                   # Shared TypeScript interfaces
│   │   ├── App.tsx                  # Root router
│   │   └── main.tsx                 # Vite entry point
│   ├── index.html
│   └── vite.config.ts
│
├── server/                          # Express Backend
│   ├── prisma/
│   │   ├── schema.prisma            # Full DB schema (15 models)
│   │   └── seed.ts                  # Database seeder
│   ├── src/
│   │   ├── classes/                 # OOP domain models (Room, User, etc.)
│   │   ├── controllers/             # Route handlers (thin layer)
│   │   │   ├── user.controller.ts
│   │   │   ├── room.controller.ts
│   │   │   ├── fee.controller.ts
│   │   │   ├── complaint.controller.ts
│   │   │   ├── leave.controller.ts
│   │   │   ├── cleaning.controller.ts
│   │   │   ├── notification.controller.ts
│   │   │   ├── student.controller.ts
│   │   │   ├── staff.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── interfaces/
│   │   │   ├── IServices.ts         # DatabaseManager (Singleton), PaginationOptions
│   │   │   └── ServiceRegistry.ts  # Central service locator
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts    # JWT verify + role guard
│   │   ├── models/                  # Prisma-generated types (extended)
│   │   ├── routes/
│   │   │   ├── index.ts             # Route aggregator → /api
│   │   │   ├── user.routes.ts       # /api/users
│   │   │   ├── student.routes.ts    # /api/student
│   │   │   ├── staff.routes.ts      # /api/staff
│   │   │   ├── admin.routes.ts      # /api/admin
│   │   │   └── health.routes.ts     # /api/health
│   │   ├── services/                # Business logic layer
│   │   │   ├── AuthService.ts
│   │   │   ├── RoomService.ts
│   │   │   ├── FeeService.ts
│   │   │   ├── ComplaintService.ts
│   │   │   ├── LeaveService.ts
│   │   │   ├── CleaningService.ts
│   │   │   ├── NotificationService.ts
│   │   │   ├── StudentService.ts
│   │   │   ├── StaffService.ts
│   │   │   └── ReportService.ts
│   │   ├── validators/
│   │   │   └── domainValidators.ts  # Zod schemas for all inputs
│   │   ├── app.ts                   # Express app setup (CORS, routes)
│   │   └── server.ts                # HTTP server entry point
│   └── tsconfig.json
│
├── Hostel_managment ER.pdf          # ER diagram (PDF)
├── uml_diagram.pdf                  # Class & sequence UML diagrams
├── use_case_diagram.pdf             # Use case diagram
└── Readme.md
```

---

## 🗄 Database Schema (ER Diagram)

```mermaid
erDiagram
    User {
        string id PK
        string email
        string passwordHash
        string firstName
        string lastName
        string phone
        enum role "STUDENT|STAFF|ADMIN"
        boolean isActive
    }
    Student {
        string id PK
        string userId FK
        string enrollmentNumber
        string course
        int year
        string parentName
        string parentPhone
        string address
    }
    Staff {
        string id PK
        string userId FK
        string employeeId
        string designation
        string department
    }
    Admin {
        string id PK
        string userId FK
        int adminLevel
    }
    Room {
        string id PK
        string roomNumber
        int floor
        string building
        enum type "SINGLE|DOUBLE|TRIPLE|DORMITORY"
        int capacity
        int occupied
        enum status "AVAILABLE|OCCUPIED|MAINTENANCE|RESERVED"
        decimal monthlyFee
    }
    RoomAllocation {
        string id PK
        string studentId FK
        string roomId FK
        enum status "ACTIVE|VACATED|TRANSFERRED"
        datetime allocatedAt
        datetime vacatedAt
    }
    FeeRecord {
        string id PK
        string studentId FK
        decimal amount
        int month
        int year
        datetime dueDate
        enum status "PENDING|PAID|OVERDUE|WAIVED"
        enum paymentMethod "ONLINE|CASH|BANK_TRANSFER|UPI"
    }
    Complaint {
        string id PK
        string studentId FK
        string resolvedById FK
        enum category "MAINTENANCE|CLEANLINESS|FOOD|SECURITY|NOISE|OTHER"
        string subject
        enum status "OPEN|IN_PROGRESS|RESOLVED|REJECTED"
    }
    LeaveRequest {
        string id PK
        string studentId FK
        string approvedById FK
        datetime fromDate
        datetime toDate
        enum status "PENDING|APPROVED|REJECTED|CANCELLED"
    }
    CleaningRequest {
        string id PK
        string studentId FK
        string roomId FK
        string assignedStaffId FK
        enum status "PENDING|IN_PROGRESS|COMPLETED"
    }
    Notification {
        string id PK
        string userId FK
        enum type "FEE_REMINDER|ROOM_ALLOCATION|LEAVE_UPDATE|COMPLAINT_UPDATE|GENERAL|CLEANING_ASSIGNED"
        boolean isRead
    }
    Report {
        string id PK
        string adminId FK
        string type
        json data
    }

    User ||--o| Student : "has"
    User ||--o| Staff : "has"
    User ||--o| Admin : "has"
    Student ||--o{ RoomAllocation : "has"
    Room ||--o{ RoomAllocation : "contains"
    Student ||--o{ FeeRecord : "has"
    Student ||--o{ Complaint : "raises"
    Admin ||--o{ Complaint : "resolves"
    Student ||--o{ LeaveRequest : "submits"
    Admin ||--o{ LeaveRequest : "approves"
    Student ||--o{ CleaningRequest : "requests"
    Staff ||--o{ CleaningRequest : "handles"
    Room ||--o{ CleaningRequest : "targetOf"
    User ||--o{ Notification : "receives"
    Admin ||--o{ Report : "generates"
```

---

## 🧩 OOP Concepts Applied

### 1. Encapsulation

Domain classes expose controlled interfaces and hide internal state. The `Room` class encapsulates allocation logic:

```typescript
// server/src/classes/Room.ts
export class Room {
  private _occupied: number;
  private _status: RoomStatus;

  get occupied() { return this._occupied; }
  get status()   { return this._status; }

  allocate(): void {
    if (this._status !== RoomStatus.AVAILABLE)
      throw new Error("Room is not available for allocation.");
    this._occupied += 1;
    if (this._occupied >= this._capacity)
      this._status = RoomStatus.OCCUPIED;
  }

  deallocate(): void {
    if (this._occupied <= 0) throw new Error("No occupants to remove.");
    this._occupied -= 1;
    if (this._occupied < this._capacity)
      this._status = RoomStatus.AVAILABLE;
  }

  toJSON() { /* safe serialization */ }
}
```

### 2. Inheritance

`Student`, `Staff`, and `Admin` all extend a common `User` base in the Prisma schema and in the JWT payload structure. The `JwtPayload` carries `userId`, `role`, and `subId` (role-specific record ID), enabling polymorphic role handling at the middleware layer.

### 3. Polymorphism

The `requireRole()` middleware accepts a variadic list of roles and dispatches access control polymorphically — the same middleware function handles STUDENT, STAFF, and ADMIN constraints:

```typescript
// Used polymorphically across all route files
router.use(verifyToken, requireRole("STUDENT"));
router.use(verifyToken, requireRole("ADMIN"));
router.use(verifyToken, requireRole("STAFF"));
```

The `allocateRoom` controller resolves at runtime whether to allocate a student or staff, based on the presence of `staffId` in the request body — a form of runtime polymorphism.

### 4. Abstraction

The `DatabaseManager` class abstracts all Prisma connection details behind a clean interface. Services only interact with `DatabaseManager.getInstance().client` and never manage connection lifecycle themselves:

```typescript
// server/src/interfaces/IServices.ts
export class DatabaseManager {
  private static instance: DatabaseManager;
  private _client: PrismaClient;

  static getInstance(): DatabaseManager { ... }
  get client(): PrismaClient { return this._client; }
  async connect(): Promise<void> { ... }
  async disconnect(): Promise<void> { ... }
}
```

The `ServiceRegistry` further abstracts the wiring of all service singletons, so controllers never instantiate services directly.

---

## 🎨 Design Patterns

### Singleton Pattern

`DatabaseManager` guarantees a single shared `PrismaClient` instance across the entire application — preventing connection pool exhaustion:

```typescript
static getInstance(): DatabaseManager {
  if (!DatabaseManager.instance) {
    DatabaseManager.instance = new DatabaseManager();
  }
  return DatabaseManager.instance;
}
```

`ServiceRegistry` applies the same pattern to ensure each service (RoomService, AuthService, etc.) is instantiated only once.

### Strategy Pattern

Payment processing supports multiple strategies (`ONLINE`, `CASH`, `BANK_TRANSFER`, `UPI`) modeled as an enum in the Prisma schema. The fee controller selects the strategy at runtime based on request input — new payment methods can be added without altering existing business logic.

### Repository Pattern

Each service acts as a repository, encapsulating all database queries for its domain. Controllers never touch Prisma directly — they only call service methods:

```
Controller → Service (Repository) → Prisma ORM → MySQL
```

### Observer Pattern

The `Notification` system implements a lightweight observer: when room allocation, leave approval, complaint resolution, or cleaning assignment events occur, the `NotificationService` dispatches typed notifications (`ROOM_ALLOCATION`, `LEAVE_UPDATE`, etc.) to the target user, decoupling event producers from consumers.

### Facade Pattern

The `apiClient.ts` on the frontend acts as a Facade over Axios — it centralizes base URL configuration, JWT injection, and 401 redirect handling, so every service module gets a pre-configured HTTP client with one import.

---

## ✅ SOLID Principles

| Principle | Implementation |
|-----------|---------------|
| **Single Responsibility (SRP)** | Each service handles exactly one domain: `RoomService` manages rooms only; `FeeService` manages fees only; `AuthService` handles auth only. Controllers are thin — they parse requests and delegate to services. |
| **Open / Closed (OCP)** | New payment methods, room types, or complaint categories can be added as enum values without modifying existing service code. New roles can be registered in `requireRole()` without changing the middleware internals. |
| **Liskov Substitution (LSP)** | `Student`, `Staff`, and `Admin` records are linked to `User` via a one-to-one relation. Any user can be treated as a base `User` at the middleware level; role-specific behaviour is accessed only when needed via `subId`. |
| **Interface Segregation (ISP)** | `PaginatedResult<T>` and `PaginationOptions` are small, focused interfaces. Services only implement the methods they need — no god interfaces. Client-side service classes expose only domain-specific methods. |
| **Dependency Inversion (DIP)** | Controllers depend on the `ServiceRegistry` abstraction, not on concrete service instantiations. The `DatabaseManager` is injected via `getInstance()`, so services never create their own DB connections. |

---

## 📡 API Reference

All endpoints are prefixed with `/api`.

### Auth (`/api/users`)
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/users/student/signup` | Public | Register new student |
| POST | `/users/staff/signup` | Public | Register new staff |
| POST | `/users/student/login` | Public | Student login → JWT |
| POST | `/users/staff/login` | Public | Staff login → JWT |
| POST | `/users/admin/login` | Public | Admin login → JWT |

### Student (`/api/student`) — 🔒 STUDENT role
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/student/profile` | Get own profile |
| PUT | `/student/profile` | Update own profile |
| GET | `/student/room` | Get current room allocation |
| GET | `/student/fees` | List all fee records |
| GET | `/student/fees/summary` | Fee summary stats |
| POST | `/student/complaints` | Submit a complaint |
| GET | `/student/complaints` | List own complaints |
| POST | `/student/leaves` | Apply for leave |
| GET | `/student/leaves` | List own leave requests |
| PATCH | `/student/leaves/:id/cancel` | Cancel a leave |
| POST | `/student/cleaning` | Request room cleaning |
| GET | `/student/cleaning` | List cleaning requests |
| GET | `/student/notifications` | Get notifications |
| PATCH | `/student/notifications/:id/read` | Mark notification read |
| PATCH | `/student/notifications/read-all` | Mark all read |

### Admin (`/api/admin`) — 🔒 ADMIN role
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/students` | List all students (paginated) |
| GET | `/admin/rooms` | List all rooms |
| POST | `/admin/rooms` | Create a room |
| PUT | `/admin/rooms/:id` | Update room |
| DELETE | `/admin/rooms/:id` | Delete room |
| GET | `/admin/rooms/available` | List available rooms |
| POST | `/admin/rooms/allocate` | Allocate room to student/staff |
| POST | `/admin/rooms/deallocate` | Deallocate room |
| GET | `/admin/complaints` | View all complaints |
| PATCH | `/admin/complaints/:id` | Update complaint status |
| GET | `/admin/leaves` | View all leave requests |
| PATCH | `/admin/leaves/:id` | Approve / reject leave |
| GET | `/admin/cleaning` | View all cleaning requests |
| PATCH | `/admin/cleaning/:id` | Assign staff to cleaning |
| POST | `/admin/notifications` | Send notification |
| GET | `/admin/reports` | Generate & fetch reports |
| GET | `/admin/staff` | List all staff |

### Staff (`/api/staff`) — 🔒 STAFF role
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/staff/rooms` | View assigned rooms |
| GET | `/staff/cleaning` | View assigned cleaning tasks |
| PATCH | `/staff/cleaning/:id` | Update cleaning status |
| GET | `/staff/profile` | Get staff profile |

---

## 👥 Features by Role

### 🎓 Student Portal
- View dashboard with room occupancy, pending complaints, leave & cleaning stats
- Room details with roommates, amenities, and cleaning history
- Submit & track complaints (6 categories)
- Apply, view & cancel leave requests
- Request room cleaning & track status
- View fee records with payment method & due date
- Receive real-time notifications
- Edit profile & settings

### 🔧 Staff Portal
- View rooms assigned for maintenance
- Accept & update cleaning task status (Pending → In Progress → Completed)
- View & manage complaints routed to their area
- View own profile

### 🛡 Admin Portal
- Full student & staff management dashboard
- Room creation, editing, allocation, and deallocation (supports Student & Staff allocation)
- Complaint resolution with notes and status tracking
- Leave approval/rejection with admin remarks
- Cleaning task assignment to staff
- Notifications broadcaster
- Report generation (Fee Summary, Occupancy, Complaints, Leave)
- Analytics dashboard with charts (Recharts)

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MySQL running locally or a remote connection string
- npm ≥ 9

### 1. Clone the repository

```bash
git clone https://github.com/Nitin-0017/Hostel_Management_System.git
cd Hostel_Management_System
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file (see [Environment Variables](#-environment-variables) below).

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed initial data
npm run prisma:seed

# Start dev server
npm run dev
```

Server runs at `http://localhost:3000`

### 3. Setup the Client

```bash
cd ../client
npm install
npm run dev
```

Client runs at `http://localhost:5173`

### 4. Build for Production

```bash
# Client
cd client && npm run build

# Server
cd server && npm run build && npm start
```

---

## 🔐 Environment Variables

Create `server/.env`:

```env
# Database
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/hostel_db"

# JWT
JWT_SECRET="your_super_secret_jwt_key"
JWT_EXPIRES_IN="7d"

# App
PORT=3000
NODE_ENV=development

# Frontend origin (for CORS)
CLIENT_URL="http://localhost:5173"
```

Create `client/.env` (optional — defaults to `/api` proxy):

```env
VITE_API_URL="http://localhost:3000/api"
```

---

## 📐 UML Diagrams

The following diagrams are included in the repository root:

| Diagram | File | Description |
|---------|------|-------------|
| ER Diagram | `Hostel_managment ER.pdf` | Full database entity-relationship model |
| UML Class Diagram | `uml_diagram.pdf` | Core class hierarchy (User, Room, Student, etc.) |
| Use Case Diagram | `use_case_diagram.pdf` | Actor-system interaction flows |

**Sequence: Room Allocation Flow**

```
Admin ──► POST /admin/rooms/allocate
              │
              ▼
        allocateRoomSchema (Zod validation)
              │
              ▼
        RoomService.allocate(studentId, roomId)
              │
              ├─► Check Room exists & is AVAILABLE
              ├─► Check Student has no existing ACTIVE allocation
              └─► DB.$transaction([
                      RoomAllocation.create(ACTIVE),
                      Room.update(occupied++, status)
                  ])
              │
              ▼
        201 { success: true, data: allocation }
```

---

## 👨‍💻 Team

| Name | Enrollment No. | GitHub |
|------|---------------|--------|
| Nitin Kumar | 2401010305 | [@Nitin-0017](https://github.com/Nitin-0017) |
| Manjeet | 2401010262 | — |
| Prachee Dhar | 2401010330 | — |
| Mayank Yadav | 2401010271 | [@mayankthukran](https://github.com/mayankthukran) |
| Arun Jangir | 2401010098 | [@Arunjangir8](https://github.com/Arunjangir8) |

---

## 📄 License

This project is developed for academic purposes as part of the **System Design & Software Engineering (SDSE)** course.

---

<p align="center">
  Built with ❤️ by Team HostelHub · SDSE Project 2025
</p>

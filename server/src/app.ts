import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";

const app: Application = express();

/**
 * CORS Configuration
 * Design Pattern: Middleware Pattern
 * Allows frontend at localhost:5173 to communicate with backend
 */
const corsOptions = {
  origin: [
    "http://localhost:5173", // Vite dev frontend
    "http://localhost:5174", // Alternative frontend port
    "http://localhost:3000",  // Alternative port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

/**
 * Body Parser Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes
 */
app.use("/api", routes);

/**
 * Health Check Endpoint
 */
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

export default app;
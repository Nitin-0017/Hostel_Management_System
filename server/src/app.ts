import express, { Application } from "express";
import cors from "cors";
import routes from "./routes";

const app: Application = express();

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());

app.use("/api", routes);

app.get("/", (_req, res) => {
  res.send("API running 🚀");
});

export default app;
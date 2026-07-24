import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.route.js";
import noteRoutes from "./routes/note.route.js";
import folderRoutes from "./routes/folder.route.js";
import aiRoutes from "./routes/ai.route.js";
import pdfRoutes from "./routes/pdf.route.js";
import statRoutes from "./routes/stat.route.js";
import studyRoomRoutes from "./routes/studyRoom.route.js";
import { handleSocketConnection } from "./socket/socketHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = createServer(app);

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://studybuddy-frontend-9meh.onrender.com"],
    credentials: true,
  }
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "https://studybuddy-frontend-9meh.onrender.com"],
  credentials: true
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is awake",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/pdfs", pdfRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/study-rooms", studyRoomRoutes);

handleSocketConnection(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  connectDB();
});

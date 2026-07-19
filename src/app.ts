import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";
import { chatRouter } from "./app/modules/chat/chat.route.js";
import { sendMessageRouter } from "./app/modules/mail/mail.router.js";

const app = express();

// Parse allowed origins from environment or use defaults
// Handles both comma-separated list and falls back to common dev ports
const parseOrigins = (envValue: string | undefined): string[] => {
  if (!envValue || envValue.trim() === "") {
    // Default origins: production + common dev ports
    return [
      "https://portfolio-chat-server-2wxf.onrender.com",
      "http://localhost:3000",
      "http://localhost:5000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5000",
    ];
  }
  return envValue.split(",").map((origin) => origin.trim()).filter(Boolean);
};

const allowedOrigins = parseOrigins(process.env.ALLOWED_ORIGINS);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the Portfolio Chat Server API");
});

app.use("/api/v1/", chatRouter);
app.use("/api/v1/mail/", sendMessageRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: "Route Not Found",
  });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 400).json({
    status: error.status,
    success: false,
    message: error.message || "Bad Request",
    error,
  });
});

export default app;

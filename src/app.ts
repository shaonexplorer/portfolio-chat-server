import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";
import { chatRouter } from "./app/modules/chat/chat.route.js";
import { sendMessageRouter } from "./app/modules/mail/mail.router.js";

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : ["https://portfolio-june-26.onrender.com", "http://localhost:3000"];

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

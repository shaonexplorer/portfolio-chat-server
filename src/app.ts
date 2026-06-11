import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";
import { chatRouter } from "./app/modules/chat/chat.route.js";

const app = express();

app.use(
  cors({
    origin: [
      "https://portfolio-june-26.onrender.com",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to the Portfolio Chat Server API");
});

app.use("/api/v1/", chatRouter);

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

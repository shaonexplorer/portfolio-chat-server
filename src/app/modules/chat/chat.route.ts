import express from "express";
import { chatController } from "./chat.controller.js";

const router = express.Router();

router.post("/chat", chatController.chatResponse);

export const chatRouter = router;

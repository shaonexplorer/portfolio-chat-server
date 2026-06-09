import express from "express";
import { chatController } from "./chat.controller";

const router = express.Router();

router.post("/chat", chatController.chatResponse);

export const chatRouter = router;

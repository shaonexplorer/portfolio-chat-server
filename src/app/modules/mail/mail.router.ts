import express from "express";
import { sendMessageController } from "./mail.controller.js";

const router = express.Router();

router.post("/", sendMessageController.sendMessage);

export const sendMessageRouter = router;

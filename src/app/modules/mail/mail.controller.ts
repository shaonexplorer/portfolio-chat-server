import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendMessageService } from "./mail.service";

const sendMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await sendMessageService.sendMessage(req, res, next);

    res.status(200).json({ data });
  },
);

export const sendMessageController = {
  sendMessage,
};

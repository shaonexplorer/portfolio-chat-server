import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async.js";
import { chatService } from "./chat.service.js";

const chatResponse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await chatService.chatResponse(req);

    result.pipeUIMessageStreamToResponse(res);
  },
);

export const chatController = {
  chatResponse,
};
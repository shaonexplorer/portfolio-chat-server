import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { chatService } from "./chat.service";

const chatResponse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await chatService.chatResponse(req, res, next);

    // res.status(200).json({ data });

    result.pipeUIMessageStreamToResponse(res);
  },
);

export const chatController = {
  chatResponse,
};

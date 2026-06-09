import express from "express";

const router = express.Router();

router.post("/chat", (req, res, next) => {
  res.status(200).json({
    message: "hello from chat route",
  });
});

export const chatRouter = router;

import { createGroq } from '@ai-sdk/groq';
import "dotenv/config";

const groq = createGroq({
  // custom settings
  apiKey: process.env.GROQ_API_KEY
});

export const chatModel = groq('qwen/qwen3.8-27b');
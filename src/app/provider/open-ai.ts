import { createOpenAI } from '@ai-sdk/openai';
import "dotenv/config";

const openai = createOpenAI({
  // custom settings, e.g.
    apiKey: process.env.OPENAI_API_KEY
});

export const embeddingModel = openai.embeddingModel('text-embedding-3-small');

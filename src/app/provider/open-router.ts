import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import "dotenv/config";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export const chatModel = openrouter("openai/gpt-oss-120b:free");

export const embeddingModel = openrouter.textEmbeddingModel(
  "nvidia/llama-nemotron-embed-vl-1b-v2:free",
);

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import "dotenv/config";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export const chatModel = openrouter("poolside/laguna-xs-2.1:free");

// Using OpenAI text-embedding-3-small which produces 1536-dimensional embeddings
// This is compatible with PostgreSQL HNSW/IVFFlat indexes (max 2000 dimensions)
export const embeddingModel = openrouter.textEmbeddingModel(
  "openai/text-embedding-3-small",
);

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import "dotenv/config";

export const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

const CHAT_MODEL = process.env.CHAT_MODEL || "poolside/laguna-xs-2.1:free";
const EMBEDDING_MODEL =
  process.env.EMBEDDING_MODEL || "openai/text-embedding-3-small";

export const chatModel = openrouter(CHAT_MODEL);

// Using OpenAI text-embedding-3-small which produces 1536-dimensional embeddings
// This is compatible with PostgreSQL HNSW/IVFFlat indexes (max 2000 dimensions)
export const embeddingModel = openrouter.textEmbeddingModel(EMBEDDING_MODEL);

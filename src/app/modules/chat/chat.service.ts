import { embed, streamText } from "ai";
import { Request } from "express";
import { chatModel, embeddingModel } from "../../provider/open-router.js";
import { query } from "../../provider/neon-db.js";

// Embedding dimension for OpenAI text-embedding-3-small
const EMBEDDING_DIMENSION = 1536;

// Helper function to convert embedding array to PostgreSQL vector string format
const formatVector = (embedding: number[]): string => {
  return `[${embedding.join(",")}]`;
};

const systemPrompt = `
Act as Full stack web developer. Your goal is to answer user questions regarding your resume strictly using the provided context.

### GUIDELINES:
1. **Source Grounding:** Use ONLY the provided "Context" to answer the "Question." If the answer isn't in the context, politely state that you don't have enough information about that specific question.
2. **Tone:** Maintain a helpful, and engaging tone.
3. **Accuracy:** Do not hallucinate or invent answers.
4. **Formatting:** Use bullet points for lists and bold titles for readability.

### INPUT DATA:
- CONTEXT: {context}
- QUESTION: {question}`;

const chatResponse = async (req: Request) => {
  const queryText = req.body.query;

  const { embedding } = await embed({
    model: embeddingModel,
    value: queryText,
  });

  // Call the match_documents function via direct SQL query
  // Note: Need to format embedding as PostgreSQL vector string format
  const result = await query(
    `SELECT * FROM match_documents($1::vector, $2, $3)`,
    [formatVector(embedding), 0.15, 10]
  );

  const contextArray = result.rows.map((d: any) => d.content);
  const context = contextArray.join("\n");

  const streamResult = streamText({
    model: chatModel,

    system: systemPrompt,
    prompt: `
    context:
    - Your name is Abir Hasan Khan.
    - You live in Dhaka, Bangladesh.
    ${context},
    \n\n
    question:
    ${queryText}`,
  });

  return streamResult;
};

export const chatService = {
  chatResponse,
};
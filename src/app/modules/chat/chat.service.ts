import { embed, generateText } from "ai";
import { NextFunction, Request, Response } from "express";
import { chatModel, embeddingModel } from "../../provider/open-router";
import { supabase } from "../../provider/supabase";

const systemPrompt = `Act as Full stack web developer. Your name is Abir Hasan Khan. Your goal is to answer user questions regarding your resume strictly using the provided context.

### GUIDELINES:
1. **Source Grounding:** Use ONLY the provided "Context" to answer the "Question." If the answer isn't in the context, politely state that you don't have enough information about that specific question.
2. **Tone:** Maintain a helpful, and engaging tone.
3. **Accuracy:** Do not hallucinate or invent answers.
4. **Formatting:** Use bullet points for lists and bold titles for readability.

### INPUT DATA:
- CONTEXT: {context}
- QUESTION: {question}`;

const chatResponse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const query = req.body.query;

  const { embedding } = await embed({
    model: embeddingModel,
    value: query,
  });

  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding, // Array of numbers (the generated vector)
    match_threshold: 0.15, // Adjust based on your precision needs
    match_count: 10,
  });

  if (error) {
    console.error("Error executing semantic search:", error);
    throw new Error(error.message);
  }

  const contextArray = data.map((d: { content: string }) => d.content);
  const context = contextArray.join("\n");

  const { text } = await generateText({
    model: chatModel,

    system: systemPrompt,
    prompt: `context: ${context},\n\n question: ${query}`,
  });

  return text;
};

export const chatService = {
  chatResponse,
};

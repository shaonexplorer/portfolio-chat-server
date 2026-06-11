import { embed } from "ai";
import { embeddingModel } from "../../provider/open-router.js";
import { EmbeddingModelV3Embedding } from "@ai-sdk/provider";
import { supabase } from "../../provider/supabase.js";

export const embeddResume = async (doc: string[]) => {
  // 'embedding' is a single embedding object (number[])

  let result: { content: string; embedding: EmbeddingModelV3Embedding }[] = [];

  await Promise.all(
    doc.map(async (chunk) => {
      const { embedding } = await embed({
        model: embeddingModel,
        value: chunk,
      });
      result.push({ content: chunk, embedding });
    }),
  );

  //   console.log(result);

  // 2. Insert into the Supabase table

  // 1. Delete all existing records from the table
  const { error: truncateError } = await supabase.rpc("truncate_resume");

  if (truncateError) {
    console.error("Error truncating table:", truncateError);
    throw new Error(truncateError.message);
  }

  await Promise.all(
    result.map(async (d) => {
      const { data, error } = await supabase
        .from("resume")
        .insert([
          {
            content: d.content,
            embedding: d.embedding, // Pass the array of numbers directly
          },
        ])
        .select();

      //   console.log({ data });

      if (error) throw error;
    }),
  );
};

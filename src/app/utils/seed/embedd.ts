import { embed } from "ai";
import { embeddingModel } from "../../provider/open-router.js";
import { EmbeddingModelV3Embedding } from "@ai-sdk/provider";
import { query } from "../../provider/neon-db.js";

// Helper function to convert embedding array to PostgreSQL vector string format
const formatVector = (embedding: number[]): string => {
  return `[${embedding.join(",")}]`;
};

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

  console.log(`Generated ${result.length} embeddings`);

  // Detect embedding dimension
  const dimension = result[0]?.embedding.length || 1536;
  console.log(`Embedding dimension: ${dimension}`);

  // 1. Enable pgvector extension
  try {
    await query("CREATE EXTENSION IF NOT EXISTS vector");
    console.log("Ensured pgvector extension is enabled");
  } catch (error) {
    console.error("Error enabling pgvector extension:", error);
    throw error;
  }

  // 2. Drop and recreate the resume table with correct dimension
  // This is necessary because we can't alter vector column dimension
  try {
    await query("DROP TABLE IF EXISTS resume");
    console.log("Dropped resume table");

    await query(`CREATE TABLE resume (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      embedding vector(${dimension}) NOT NULL
    )`);
    console.log(`Created resume table with dimension ${dimension}`);
  } catch (error) {
    console.error("Error creating resume table:", error);
    throw error;
  }

  // 3. Create HNSW index for faster vector similarity search
  // HNSW supports up to 2000 dimensions, so 1536 is compatible
  try {
    await query(`CREATE INDEX idx_resume_embedding ON resume USING hnsw (embedding vector_l2_ops)`);
    console.log("Created HNSW index for vector search");
  } catch (error) {
    console.error("Error creating index:", error);
    // Continue without index - vector search will still work, just slower
  }

  // 4. Create functions for vector search
  try {
    await query(`CREATE OR REPLACE FUNCTION truncate_resume()
      RETURNS void AS $$
      BEGIN
          TRUNCATE TABLE resume;
      END;
      $$ LANGUAGE plpgsql;`);
    console.log("Created truncate_resume function");
  } catch (error) {
    console.error("Error creating truncate_resume function:", error);
    throw error;
  }

  try {
    await query(`CREATE OR REPLACE FUNCTION match_documents(
        query_embedding vector(${dimension}),
        match_threshold float DEFAULT 0.15,
        match_count int DEFAULT 10
      )
      RETURNS TABLE (
        id INTEGER,
        content TEXT,
        embedding vector(${dimension}),
        similarity FLOAT
      ) AS $$
      BEGIN
          RETURN QUERY
          SELECT
              r.id,
              r.content,
              r.embedding,
              1 - (r.embedding <=> query_embedding) AS similarity
          FROM resume r
          WHERE (1 - (r.embedding <=> query_embedding)) >= match_threshold
          ORDER BY r.embedding <=> query_embedding
          LIMIT match_count;
      END;
      $$ LANGUAGE plpgsql;`);
    console.log("Created match_documents function");
  } catch (error) {
    console.error("Error creating match_documents function:", error);
    throw error;
  }

  // 5. Insert embeddings into the Neon PostgreSQL table
  // Using batch insert for better performance
  // Note: Need to format embedding as PostgreSQL vector string format
  const values: string[] = [];
  const params: any[] = [];

  result.forEach((d, index) => {
    const contentParam = `$${index * 2 + 1}`;
    const embeddingParam = `$${index * 2 + 2}`;
    values.push(`(${contentParam}, ${embeddingParam})`);
    params.push(d.content, formatVector(d.embedding));
  });

  const insertQuery = `
    INSERT INTO resume (content, embedding)
    VALUES ${values.join(", ")}
  `;

  await query(insertQuery, params);
  console.log(`Inserted ${result.length} embeddings into resume table`);
};
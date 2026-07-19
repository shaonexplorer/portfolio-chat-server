# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working on code in this repository.

## Common Development Commands

| Action | Command | Notes |
|--------|---------|-------|
| **Install dependencies** | `npm install` | Installs both runtime and dev dependencies. |
| **Run the server in development mode** | `npm run dev` | Uses `tsx watch src/server.ts` – hot‑reloads on file changes. |
| **Build for production** | `npm run build` | Runs `prisma generate` then compiles TypeScript to `dist/`. |
| **Start the built server** | `npm start` | Executes `node dist/src/server.js`. |
| **Run a single test** | `npm test -- <test‑file>` | The placeholder test script currently just exits with an error; replace with a real test runner when tests are added. |
| **Run Prisma migrations** | `npx prisma migrate dev` | Creates/updates the PostgreSQL schema based on `prisma/schema.prisma`. |
| **Generate Prisma client** | `npx prisma generate` | Usually invoked automatically as part of the `build` step. |
| **Lint / format** | *(none configured yet)* | Add ESLint/Prettier scripts as the project evolves. |

## High‑Level Architecture

- **Entry point** – `src/server.ts` boots the Express app (`src/app.ts`), parses the resume PDF, splits it into chunks, and populates the vector store via `embeddResume()`.
- **Express app** – Defined in `src/app.ts`. Sets up CORS, JSON body parsing, cookie handling, a health route (`/`), and mounts the chat API under `/api/v1/`.
- **Chat module** – `src/app/modules/chat/`
  - `chat.route.ts` wires the HTTP endpoint to `chat.controller.ts`.
  - `chat.controller.ts` wraps the async handler with `catchAsync` and returns the stream response.
  - `chat.service.ts` performs the core workflow:
    1. Receive a user query.
    2. Embed the query using the OpenRouter embedding model.
    3. Perform a semantic search against a Neon-hosted vector table using the `match_documents` SQL function.
    4. Build a system prompt (`systemPrompt`) that forces the LLM to answer **only** from the retrieved context.
    5. Generate a response with the OpenRouter chat model.
- **Providers** – `src/app/provider/`
  - `open-router.ts` creates the OpenRouter client, exposing `chatModel` (GPT‑OSS‑120b) and `embeddingModel` (OpenAI text-embedding-3-small with 1536 dimensions).
  - `neon-db.ts` creates a Neon PostgreSQL connection pool using the `pg` library with `DATABASE_URL`. It provides `query()`, `queryRows()`, `queryRow()`, and `closePool()` helpers.
  - `supabase.ts` is deprecated (kept for reference) - replaced by `neon-db.ts`.
- **Database layer** – `src/app/lib/prisma.ts` creates a Prisma client using the PostgreSQL adapter (`@prisma/adapter-pg`). The generated client lives in `generated/prisma/client.js` after `prisma generate`.
- **Resume ingestion utilities** – `src/app/utils/seed/`
  - `parse-resume.ts` parses the PDF resume (`pdf-parse`).
  - `text-splitter.ts` splits the raw text into manageable chunks.
  - `embedd.ts` stores each chunk as an embedding in Neon PostgreSQL via direct SQL queries. Automatically creates the table, HNSW index, and SQL functions on first run.
- **Error handling** – Centralised in `src/app.ts` with a generic error middleware and a 404 handler.

## Important Files / Directories

- `package.json` – Scripts, dependencies, and Node version expectations.
- `tsconfig.json` – Compiles to ES2023, outputs to `dist/`, enables strict type‑checking.
- `prisma/schema.prisma` – Database schema definition for user/task data.
- `prisma/migrations/seed_neon_sql` – SQL file for creating the resume table, HNSW index, and vector search functions.
- `.env` (not checked in) – Holds secret configuration:
  - `OPEN_ROUTER_API_KEY`
  - `DATABASE_URL` (Neon PostgreSQL connection string)
  - `PORT`
- `src/app/utils/catch-async.ts` – Helper to wrap async Express handlers.

## Development Tips for Claude Code

1. **Run the server locally** – Ensure required env vars are present. A typical `.env` might look like:
   ```
   OPEN_ROUTER_API_KEY=your-openrouter-key
   DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/database_name?sslmode=require
   PORT=3000
   ```
2. **When adding new routes or services** – Update the corresponding route, controller, and service files under `src/app/modules/<name>/`. Keep the pattern of `router → controller → service` consistent.
3. **Database changes** – Modify `prisma/schema.prisma`, then run `npm run build` (which calls `prisma generate`) or `npx prisma migrate dev` to apply migrations.
4. **Embedding pipeline** – The start‑up sequence parses the resume, splits text, and calls `embeddResume`. If you adjust the resume format, update `parse-resume.ts` and/or the text splitter accordingly.
5. **Testing** – No test suite is currently configured. Consider adding a test runner (e.g., Jest) and populate the `scripts.test` entry when tests are written.

## Database Schema

### Prisma Schema (`prisma/schema.prisma`)
- `User` model: id, email, name
- `Task` model: id, title, description, status, priority, createdAt, updatedAt, userId (relation)

### Resume Table (created by `embedd.ts`)
- `id`: SERIAL PRIMARY KEY
- `content`: TEXT NOT NULL
- `embedding`: vector(1536) NOT NULL

### Vector Search Functions (created by `embedd.ts`)
- `truncate_resume()`: Clears the resume table
- `match_documents(query_embedding, match_threshold, match_count)`: Returns similar documents using cosine similarity

## Known Gaps / TODOs

- Linting / formatting scripts are not present.
- Unit / integration tests are missing.
- No explicit health‑check endpoint besides the root GET.
- The chat system prompt is hard‑coded; consider externalising it for easier tuning.

## CORS Configuration

The CORS middleware in `src/app.ts` allows requests from multiple origins:
- **Production**: `https://portfolio-june-26.onrender.com`
- **Development**: `http://localhost:3000`, `http://localhost:5000`, `http://127.0.0.1:3000`, `http://127.0.0.1:5000`

To add custom origins, set the `ALLOWED_ORIGINS` environment variable in `.env`:
```
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

The configuration handles empty strings and whitespace gracefully, falling back to defaults.

## Embedding Model Notes

- Using **OpenAI text-embedding-3-small** which produces **1536-dimensional embeddings**.
- PostgreSQL's HNSW and IVFFlat indexes support up to **2000 dimensions**, so 1536 is fully compatible with indexing.
- The `embedd.ts` automatically detects the embedding dimension and recreates the table with the correct schema if needed.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check / welcome message |
| POST | `/api/v1/chat` | Chat with the portfolio assistant |
| POST | `/api/v1/mail/send` | Send an email |

---
*Generated by Claude Code – keep this file up‑to‑date as the project evolves.*
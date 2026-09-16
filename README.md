# Portfolio Chat Server

This backend server powers a portfolio chat assistant. It uses Retrieval-Augmented Generation (RAG) to provide intelligent responses based on the owner's resume, leveraging Neon PostgreSQL for vector storage and OpenRouter for LLM and embedding services.

## Features

*   **RAG-based Chat**: Intelligent responses based on parsed resume data.
*   **Vector Search**: Efficient semantic search using Neon PostgreSQL (`pgvector` and HNSW index).
*   **API Endpoints**: RESTful endpoints for chat and email functionality.
*   **Resume Ingestion**: Automatic parsing and embedding of the resume PDF on startup.

## Prerequisites

*   Node.js (v20+)
*   Neon PostgreSQL database (with `pgvector` extension enabled)

## Setup

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd portfolio-chat-server
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment**:
    Create a `.env` file in the root directory and populate it:
    ```env
    OPEN_ROUTER_API_KEY=your-openrouter-key
    DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/database_name?sslmode=require
    PORT=3000
    # Optional: ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
    ```

## Development Commands

| Action | Command |
|--------|---------|
| Install dependencies | `npm install` |
| Run in dev mode | `npm run dev` |
| Build for production | `npm run build` |
| Start server | `npm start` |
| Run migrations | `npx prisma migrate dev` |

## Architecture

The project follows a `router -> controller -> service` pattern:

*   **Entry**: `src/server.ts` boots the app and triggers resume ingestion.
*   **App**: Express app defined in `src/app.ts`.
*   **Modules**: Chat logic resides in `src/app/modules/chat/`.
*   **Providers**: External services (OpenRouter, Neon DB) in `src/app/provider/`.
*   **Utils**: Resume parsing and embedding logic in `src/app/utils/`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST | `/api/v1/chat` | Chat with the assistant |
| POST | `/api/v1/mail/send` | Send an email |

---
*Maintained by the development team.*

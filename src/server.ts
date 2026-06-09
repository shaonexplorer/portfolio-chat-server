import app from "./app.js";
import { Server } from "http";

import "dotenv/config";
import { prisma } from "./app/lib/prisma.js";
import { parseDoc } from "./app/utils/seed/parse-resume.js";
import { embeddResume } from "./app/utils/seed/embedd.js";
import { splitText } from "./app/utils/seed/text-splitter.js";

const port = process.env.PORT;

let server: Server;

const startServer = async () => {
  try {
    const parsedDoc = await parseDoc();
    console.log("*** resume parsed successfully ***");

    const chunks = await splitText(parsedDoc);

    console.log(" populating database with embeddings ...");

    await embeddResume(chunks);

    console.log(" *** database populated successfully ***");

    // await prisma.$connect();
    // console.log("*** database connected successfully ***");

    server = app.listen(port, () => {
      console.log(`*** server is running on port: ${port} ***`);
    });
  } catch (error) {
    // console.log("*** error on connecting database...");
    console.error(error);
  }
};

(async () => {
  await startServer();
})();

process.on("unhandledRejection", (err) => {
  console.log("server is closing... ");
  console.log(err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("server is closing... ");
  console.log(err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", (err) => {
  console.log("server is closing... ");
  console.log(err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const splitText = async (doc: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    separators: [
      "\n\n",
      "\n",
      " ",
      ".",
      ",",
      "\u200b", // Zero-width space
      "\uff0c", // Fullwidth comma
      "\u3001", // Ideographic comma
      "\uff0e", // Fullwidth full stop
      "\u3002", // Ideographic stop
      "",
    ],
  });
  const chunks = await splitter.splitText(doc);
  //   console.log({ chunks });

  return chunks;
};

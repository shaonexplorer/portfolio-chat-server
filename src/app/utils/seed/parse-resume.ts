import { PDFParse } from "pdf-parse";
import * as fs from "fs";
import * as path from "path";

export async function parseDoc() {
  try {
    // 1. Fix: Call process.cwd() as a function and use path.join for cross-platform safety
    const filePath = path.join(
      process.cwd(),
      "file",
      "resume",
      "Abir-Hasan-Khan.pdf",
    );

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);

    // 2. Instantiate the parser with the buffer data
    const parser = new PDFParse({ data: dataBuffer });

    // 3. Call getText() on the instance
    const result = await parser.getText();

    // 4. Clean up the parser instance memory when done
    await parser.destroy();

    // Note: If 'result' is already a string, just return 'result'.
    // If it's an object, return 'result.text'. Let's handle both dynamically:
    return typeof result === "object" && result !== null
      ? (result as any).text
      : result;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw error; // Re-throw so your server setup knows the seeding failed
  }
}

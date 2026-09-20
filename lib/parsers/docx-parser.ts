import mammoth from "mammoth";
import { cleanParsedText } from "./pdf-parser";

/**
 * Parses DOCX buffer into normalized plain text.
 */
export async function parseDOCX(buffer: Buffer): Promise<{ text: string }> {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error("EMPTY_FILE: Provided DOCX buffer is empty.");
    }

    const result = await mammoth.extractRawText({ buffer });
    const rawText = result.value || "";
    const cleanedText = cleanParsedText(rawText);

    if (!cleanedText || cleanedText.trim().length === 0) {
      throw new Error("EMPTY_RESUME: The DOCX document contained no readable text.");
    }

    return {
      text: cleanedText,
    };
  } catch (error: any) {
    if (error.message?.includes("EMPTY_")) {
      throw error;
    }
    throw new Error(`RESUME_PARSE_FAILED: Failed to parse DOCX resume (${error.message || "Unknown error"})`);
  }
}

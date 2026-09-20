import pdfParse from "pdf-parse";

/**
 * Parses PDF buffer into normalized text.
 */
export async function parsePDF(buffer: Buffer): Promise<{ text: string; numPages: number }> {
  try {
    if (!buffer || buffer.length === 0) {
      throw new Error("EMPTY_FILE: Provided PDF buffer is empty.");
    }

    const data = await pdfParse(buffer);
    const rawText = data.text || "";

    // Normalize text while keeping key punctuation and newlines
    const cleanedText = cleanParsedText(rawText);

    if (!cleanedText || cleanedText.trim().length === 0) {
      throw new Error("EMPTY_RESUME: The PDF contained no readable text.");
    }

    return {
      text: cleanedText,
      numPages: data.numpages || 1,
    };
  } catch (error: any) {
    if (error.message?.includes("encrypted") || error.message?.includes("password")) {
      throw new Error("PASSWORD_PROTECTED: The PDF is password protected.");
    }
    if (error.message?.includes("EMPTY_")) {
      throw error;
    }
    throw new Error(`RESUME_PARSE_FAILED: Failed to parse PDF resume (${error.message || "Unknown error"})`);
  }
}

/**
 * Normalizes text extracted from PDF or DOCX without stripping technology symbols (C++, C#, .NET, Node.js).
 */
export function cleanParsedText(text: string): string {
  if (!text) return "";

  return text
    // Replace non-printable ASCII/control chars (keep newlines and tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
    // Normalize unicode spaces
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    // Normalize multiple spaces into a single space within a line
    .replace(/[ \t]+/g, " ")
    // Remove 3 or more consecutive empty lines
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}

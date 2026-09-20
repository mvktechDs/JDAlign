import { MAX_FILE_SIZE_BYTES } from "../config/app";

export interface FileValidationResult {
  valid: boolean;
  fileType: "pdf" | "docx" | "unknown";
  errorCode?:
    | "INVALID_FILE"
    | "FILE_TOO_LARGE"
    | "UNSUPPORTED_FILE_TYPE"
    | "EMPTY_RESUME"
    | "CORRUPTED_FILE";
  errorMessage?: string;
}

/**
 * Validates uploaded resume file using multiple signals (extension, MIME, magic bytes, size).
 */
export function validateUploadFile(file: File | null, buffer: Buffer): FileValidationResult {
  if (!file || !buffer || buffer.length === 0) {
    return {
      valid: false,
      fileType: "unknown",
      errorCode: "EMPTY_RESUME",
      errorMessage: "Uploaded file is empty or missing.",
    };
  }

  // 1. File Size Check
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      fileType: "unknown",
      errorCode: "FILE_TOO_LARGE",
      errorMessage: `File size exceeds maximum allowed limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB.`,
    };
  }

  const fileName = (file.name || "").toLowerCase();

  // 2. Extension validation
  const isPdfExt = fileName.endsWith(".pdf");
  const isDocxExt = fileName.endsWith(".docx");

  if (!isPdfExt && !isDocxExt) {
    return {
      valid: false,
      fileType: "unknown",
      errorCode: "UNSUPPORTED_FILE_TYPE",
      errorMessage: "Unsupported format. Only .pdf and .docx files are supported.",
    };
  }

  // 3. Magic Bytes Inspection
  const isPdfMagic = checkMagicBytes(buffer, [0x25, 0x50, 0x44, 0x46, 0x2d]); // %PDF-
  const isDocxMagic = checkMagicBytes(buffer, [0x50, 0x4b, 0x03, 0x04]); // PK\x03\x04 (Zip archive for docx)

  if (isPdfExt) {
    if (!isPdfMagic) {
      return {
        valid: false,
        fileType: "pdf",
        errorCode: "CORRUPTED_FILE",
        errorMessage: "The uploaded file has a .pdf extension but invalid header bytes.",
      };
    }
    return { valid: true, fileType: "pdf" };
  }

  if (isDocxExt) {
    if (!isDocxMagic) {
      return {
        valid: false,
        fileType: "docx",
        errorCode: "CORRUPTED_FILE",
        errorMessage: "The uploaded file has a .docx extension but invalid zip header bytes.",
      };
    }
    return { valid: true, fileType: "docx" };
  }

  return {
    valid: false,
    fileType: "unknown",
    errorCode: "UNSUPPORTED_FILE_TYPE",
    errorMessage: "Please upload a valid PDF or DOCX resume document.",
  };
}

function checkMagicBytes(buffer: Buffer, expectedBytes: number[]): boolean {
  if (buffer.length < expectedBytes.length) return false;
  for (let i = 0; i < expectedBytes.length; i++) {
    if (buffer[i] !== expectedBytes[i]) return false;
  }
  return true;
}

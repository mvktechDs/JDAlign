import { describe, it, expect } from "vitest";
import { validateUploadFile } from "@/lib/security/upload-validator";

describe("Upload Security File Validation", () => {
  it("approves valid PDF document buffer with PDF magic bytes", () => {
    const file = new File(["dummy content"], "resume.pdf", { type: "application/pdf" });
    const pdfBuffer = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x35]); // %PDF-

    const result = validateUploadFile(file, pdfBuffer);
    expect(result.valid).toBe(true);
    expect(result.fileType).toBe("pdf");
  });

  it("approves valid DOCX document buffer with PK zip magic bytes", () => {
    const file = new File(["dummy content"], "resume.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    const docxBuffer = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00]); // PK\x03\x04

    const result = validateUploadFile(file, docxBuffer);
    expect(result.valid).toBe(true);
    expect(result.fileType).toBe("docx");
  });

  it("rejects files exceeding 2 MB size limit", () => {
    const file = new File(["dummy content"], "resume.pdf", { type: "application/pdf" });
    const largeBuffer = Buffer.alloc(3 * 1024 * 1024); // 3 MB

    const result = validateUploadFile(file, largeBuffer);
    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe("FILE_TOO_LARGE");
  });

  it("rejects invalid/executable files disguised as PDF extension", () => {
    const file = new File(["dummy content"], "fake.pdf", { type: "application/pdf" });
    const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00]); // MZ executable header

    const result = validateUploadFile(file, exeBuffer);
    expect(result.valid).toBe(false);
    expect(result.errorCode).toBe("CORRUPTED_FILE");
  });
});

/**
 * Scrubs identifiable candidate personal information (PII) from resume text
 * before sending data to external AI processing services.
 */
export function redactPII(text: string): { redactedText: string; redactionCount: number } {
  if (!text || typeof text !== "string") {
    return { redactedText: "", redactionCount: 0 };
  }

  let count = 0;
  let redacted = text;

  // 1. Email Redaction
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  redacted = redacted.replace(emailRegex, () => {
    count++;
    return "[EMAIL_REDACTED]";
  });

  // 2. Phone Number Redaction
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  redacted = redacted.replace(phoneRegex, () => {
    count++;
    return "[PHONE_REDACTED]";
  });

  // 3. URLs (LinkedIn, GitHub, Portfolios, HTTP/HTTPS links)
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<"']+/gi;
  redacted = redacted.replace(urlRegex, () => {
    count++;
    return "[URL_REDACTED]";
  });

  // 4. Specific social/profile handle patterns (e.g. linkedin.com/in/john-doe, github.com/johndoe)
  const profileRegex = /(?:linkedin\.com\/in\/|github\.com\/)[a-zA-Z0-9_-]+/gi;
  redacted = redacted.replace(profileRegex, () => {
    count++;
    return "[URL_REDACTED]";
  });

  // 5. Street Address patterns (e.g., 123 Main St, Apartment 4B)
  const addressRegex = /\b\d{1,5}\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Terrace|Ter|Court|Ct|Place|Pl)\b/gi;
  redacted = redacted.replace(addressRegex, () => {
    count++;
    return "[ADDRESS_REDACTED]";
  });

  // 6. Enhanced Candidate Name Redaction Heuristic (Inspect top 5 non-empty lines)
  const lines = redacted.split("\n");
  let nonEmptyCount = 0;

  const reservedTitlesOrHeadings = /^(resume|curriculum|vitae|summary|profile|professional\s+summary|experience|work\s+experience|skills|technical\s+skills|education|projects|full\s+stack|software|backend|frontend|web|lead|senior|junior|principal|architect|engineer|developer|manager|consultant|specialist|designer|analyst)$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    nonEmptyCount++;
    if (nonEmptyCount > 5) break;

    // Check if line looks like candidate name:
    // - Length between 3 and 40 chars
    // - 2 to 5 words
    // - Alphabetic characters, spaces, dots, or hyphens only
    // - Does not contain numbers, email, phone, or URL placeholders
    // - Does not match reserved titles/headings
    if (
      line.length >= 3 &&
      line.length <= 40 &&
      !line.includes("[") &&
      !reservedTitlesOrHeadings.test(line) &&
      !/developer|engineer|manager|architect|designer|summary|profile|experience|skills|education/i.test(line)
    ) {
      const words = line.split(/\s+/);
      const isNamePattern =
        words.length >= 2 &&
        words.length <= 5 &&
        words.every((w) => /^[A-Za-z][A-Za-z.\-']*$/.test(w));

      if (isNamePattern) {
        lines[i] = "[NAME_REDACTED]";
        count++;
        redacted = lines.join("\n");
        break; // Stop after redacting top candidate name header
      }
    }
  }

  return {
    redactedText: redacted,
    redactionCount: count,
  };
}


import { describe, it, expect } from "vitest";
import { redactPII } from "@/lib/security/pii-redactor";

describe("PII Redaction Engine Unit Tests", () => {
  it("redacts email addresses, phone numbers, portfolio URLs, and street addresses", () => {
    const rawResume = `
Alex Example
Email: alex.example@test.com
Phone: +1 (555) 234-5678
LinkedIn: https://linkedin.com/in/alexexample
GitHub: https://github.com/alexexample
Address: 742 Evergreen Terrace

Experienced Software Engineer with React and Node.js skills.
`;

    const { redactedText, redactionCount } = redactPII(rawResume);

    expect(redactedText).toContain("[EMAIL_REDACTED]");
    expect(redactedText).toContain("[PHONE_REDACTED]");
    expect(redactedText).toContain("[URL_REDACTED]");
    expect(redactedText).toContain("[ADDRESS_REDACTED]");
    expect(redactedText).toContain("[NAME_REDACTED]");
    expect(redactedText).not.toContain("alex.example@test.com");
    expect(redactedText).not.toContain("https://linkedin.com/in/alexexample");
    expect(redactionCount).toBeGreaterThanOrEqual(4);
  });

  it("redacts candidate name on line 1, line 2, line 3, or after blank spaces", () => {
    const resume1 = `Kundappan M V\nSenior Developer`;
    expect(redactPII(resume1).redactedText).toContain("[NAME_REDACTED]");

    const resume2 = `\n\nJohn A. Smith\nFull Stack Engineer`;
    expect(redactPII(resume2).redactedText).toContain("[NAME_REDACTED]");

    const resume3 = `PROFILE\n\nJANE MARY WATSON\nSoftware Developer`;
    expect(redactPII(resume3).redactedText).toContain("[NAME_REDACTED]");
  });

  it("CRITICAL SAFETY TEST: Job titles and section headings MUST NOT be redacted as candidate names", () => {
    const text1 = `FULL STACK DEVELOPER\nExperienced engineer...`;
    expect(redactPII(text1).redactedText).not.toContain("[NAME_REDACTED]");
    expect(redactPII(text1).redactedText).toContain("FULL STACK DEVELOPER");

    const text2 = `PROFESSIONAL SUMMARY\nSoftware Engineer with 3 years experience.`;
    expect(redactPII(text2).redactedText).not.toContain("[NAME_REDACTED]");

    const text3 = `TECHNICAL SKILLS\nReact, Node.js, PostgreSQL`;
    expect(redactPII(text3).redactedText).not.toContain("[NAME_REDACTED]");
  });
});

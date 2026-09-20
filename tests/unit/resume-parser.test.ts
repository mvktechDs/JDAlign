import { describe, it, expect } from "vitest";
import { parseResume } from "@/lib/parsers/resume-parser";

describe("Resume Parser Unit Tests", () => {
  it("should extract skills, experience, projects, and education sections", () => {
    const resumeText = `
TECHNICAL SKILLS
Languages & Frameworks: C++, C#, .NET, Node.js, Next.js, React, TypeScript

WORK EXPERIENCE
Senior Developer | Acme Corp
Jan 2022 - Present (2 years)
- Architected microservices with Node.js and C# .NET.

PROJECTS
- E-Commerce Platform built with Next.js and TypeScript

EDUCATION
- Bachelor of Science in Computer Science, State University
`;

    const parsed = parseResume(resumeText);

    expect(parsed.skills).toContain("C++");
    expect(parsed.skills).toContain("C#");
    expect(parsed.skills).toContain(".NET");
    expect(parsed.skills).toContain("Node.js");
    expect(parsed.skills).toContain("Next.js");
    expect(parsed.skills).toContain("React");
    expect(parsed.skills).toContain("TypeScript");

    expect(parsed.experienceMonths).toBe(24);
    expect(parsed.projects.length).toBeGreaterThan(0);
    expect(parsed.education.length).toBeGreaterThan(0);
  });

  it("should handle non-standard section order and missing optional sections gracefully", () => {
    const minimalResume = `
Jane Doe
Software Developer

SUMMARY
Enthusiastic full-stack engineer.

SKILLS
React, JavaScript, HTML5, CSS3

EXPERIENCE
Frontend Engineer - 18 months
Building responsive web apps.
`;

    const parsed = parseResume(minimalResume);

    expect(parsed.skills).toContain("React");
    expect(parsed.skills).toContain("JavaScript");
    expect(parsed.experienceMonths).toBe(18);
    expect(parsed.projects).toEqual([]);
    expect(parsed.education).toEqual([]);
  });
});

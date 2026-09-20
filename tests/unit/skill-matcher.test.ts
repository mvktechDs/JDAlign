import { describe, it, expect } from "vitest";
import { matchSkills } from "@/lib/scoring/skill-matcher";
import { normalizeSkill } from "@/lib/skills/normalize-skill";

describe("Skill Matcher & Alias Normalization Unit Tests", () => {
  it("should normalize skill aliases to canonical display names", () => {
    expect(normalizeSkill("ReactJS").canonical).toBe("React");
    expect(normalizeSkill("react.js").canonical).toBe("React");
    expect(normalizeSkill("NodeJS").canonical).toBe("Node.js");
    expect(normalizeSkill("Postgres").canonical).toBe("PostgreSQL");
    expect(normalizeSkill("JS").canonical).toBe("JavaScript");
    expect(normalizeSkill("TS").canonical).toBe("TypeScript");
    expect(normalizeSkill("Mongo").canonical).toBe("MongoDB");
    expect(normalizeSkill("ExpressJS").canonical).toBe("Express.js");
    expect(normalizeSkill("NextJS").canonical).toBe("Next.js");
    expect(normalizeSkill("TailwindCSS").canonical).toBe("Tailwind CSS");
    expect(normalizeSkill("RESTful API").canonical).toBe("REST API");
  });

  it("should perform direct and alias skill matching between resume and JD", () => {
    const resumeSkills = ["ReactJS", "NodeJS", "Postgres", "TS"];
    const jdRequired = ["React", "Node.js", "PostgreSQL", "TypeScript"];

    const result = matchSkills(resumeSkills, jdRequired, []);

    expect(result.scorePercentage).toBe(100);
    expect(result.matched.length).toBe(4);
    expect(result.missingRequired.length).toBe(0);
  });

  it("should identify related technology experience as PARTIAL_MATCH without marking as direct match", () => {
    const resumeSkills = ["Azure", "MySQL", "Vue"];
    const jdRequired = ["AWS", "PostgreSQL", "React"];

    const result = matchSkills(resumeSkills, jdRequired, []);

    expect(result.matched.length).toBe(0); // AWS != Azure
    expect(result.partial.length).toBe(3); // Cloud, Relational DB, Frontend clusters match partially
    expect(result.scorePercentage).toBe(50); // 3 partials @ 50% each
  });

  it("CRITICAL SAFETY TEST: Unrelated technologies MUST NOT become full direct matches", () => {
    // React != Angular
    const res1 = matchSkills(["Angular"], ["React"]);
    expect(res1.matched.length).toBe(0);

    // AWS != Azure (direct match must be false)
    const res2 = matchSkills(["Azure"], ["AWS"]);
    expect(res2.matched.length).toBe(0);
    expect(res2.matched.some((m) => m.name === "AWS")).toBe(false);

    // MongoDB != MySQL
    const res3 = matchSkills(["MongoDB"], ["MySQL"]);
    expect(res3.matched.length).toBe(0);

    // PostgreSQL != MongoDB
    const res4 = matchSkills(["PostgreSQL"], ["MongoDB"]);
    expect(res4.matched.length).toBe(0);
  });
});

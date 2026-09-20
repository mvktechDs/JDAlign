import { describe, it, expect } from "vitest";
import { parseExperience } from "@/lib/parsers/experience-parser";

describe("Experience Expression Parser", () => {
  it("parses year expressions accurately into normalized months", () => {
    expect(parseExperience("2 years").normalizedMonths).toBe(24);
    expect(parseExperience("2+ years").normalizedMonths).toBe(24);
    expect(parseExperience("2.5 years").normalizedMonths).toBe(30);
    expect(parseExperience("minimum 3 yrs").normalizedMonths).toBe(36);
    expect(parseExperience("at least 5 years").normalizedMonths).toBe(60);
  });

  it("parses year ranges taking the minimum bound", () => {
    expect(parseExperience("3-5 years").normalizedMonths).toBe(36);
  });

  it("parses explicit month expressions", () => {
    expect(parseExperience("24 months").normalizedMonths).toBe(24);
    expect(parseExperience("18 mos").normalizedMonths).toBe(18);
  });
});

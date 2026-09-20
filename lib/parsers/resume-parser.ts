import { parseExperience } from "./experience-parser";
import { SKILL_ALIASES } from "../skills/aliases";
import { normalizeSkill } from "../skills/normalize-skill";

export interface StructuredResume {
  rawText: string;
  skills: string[];
  experienceMonths: number | null;
  experienceText: string;
  projects: string[];
  education: string[];
  sections: Record<string, string>;
}

/**
 * Extracts structured data from raw resume text.
 */
export function parseResume(rawText: string): StructuredResume {
  const normalizedText = rawText || "";

  // 1. Split into common sections
  const sections = extractSections(normalizedText);

  // 2. Extract skills using alias catalog and regex pattern matching
  const skills = extractSkillsFromResume(normalizedText);

  // 3. Extract experience months
  const expSectionText = sections.experience || normalizedText;
  const parsedExp = parseExperience(expSectionText);
  const experienceMonths = parsedExp.normalizedMonths;

  // 4. Extract projects and education items
  const projects = extractListItems(sections.projects || "");
  const education = extractListItems(sections.education || "");

  return {
    rawText: normalizedText,
    skills,
    experienceMonths,
    experienceText: expSectionText,
    projects,
    education,
    sections,
  };
}

/**
 * Splits resume into sections based on typical headings.
 */
function extractSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {
    skills: "",
    experience: "",
    projects: "",
    education: "",
    certifications: "",
  };

  const lines = text.split("\n");
  let currentSection = "summary";

  const headingPatterns: Record<string, RegExp> = {
    skills: /^(technical\s+skills?|skills?|technologies|core\s+competencies|tools\s*&\s*frameworks)/i,
    experience: /^(work\s+experience|professional\s+experience|employment\s+history|experience|career\s+history)/i,
    projects: /^(projects|key\s+projects|featured\s+projects|personal\s+projects)/i,
    education: /^(education|academic\s+background|qualifications)/i,
    certifications: /^(certifications?|licenses|credentials)/i,
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let matchedHeading = false;
    for (const [sectionKey, pattern] of Object.entries(headingPatterns)) {
      if (pattern.test(trimmed) && trimmed.length < 50) {
        currentSection = sectionKey;
        matchedHeading = true;
        break;
      }
    }

    if (!matchedHeading) {
      if (!sections[currentSection]) {
        sections[currentSection] = trimmed;
      } else {
        sections[currentSection] += "\n" + trimmed;
      }
    }
  }

  return sections;
}

/**
 * Scans resume text for matches against known skill catalog and tech patterns.
 */
function extractSkillsFromResume(text: string): string[] {
  const detectedSkills = new Set<string>();
  const lowerText = text.toLowerCase();

  // Check all known skill aliases
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    // Check canonical name
    const canonicalEscaped = escapeRegex(canonical.toLowerCase());
    let canonicalPrefix = "(?:^|[^a-zA-Z0-9+#])";
    if (canonical.toLowerCase() === "js") canonicalPrefix = "(?:^|[^a-zA-Z0-9+#.])";
    const canonicalRegex = new RegExp(`${canonicalPrefix}${canonicalEscaped}(?:$|[^a-zA-Z0-9+#])`, "i");
    if (canonicalRegex.test(text)) {
      detectedSkills.add(canonical);
      continue;
    }

    // Check aliases
    for (const alias of aliases) {
      const aliasEscaped = escapeRegex(alias.toLowerCase());
      let aliasPrefix = "(?:^|[^a-zA-Z0-9+#])";
      if (alias.toLowerCase() === "js") aliasPrefix = "(?:^|[^a-zA-Z0-9+#.])";
      const aliasRegex = new RegExp(`${aliasPrefix}${aliasEscaped}(?:$|[^a-zA-Z0-9+#])`, "i");
      if (aliasRegex.test(lowerText)) {
        detectedSkills.add(canonical);
        break;
      }
    }
  }

  return Array.from(detectedSkills);
}

function extractListItems(text: string): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.replace(/^[\s•\-\*]+/, "").trim())
    .filter((line) => line.length > 5);
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

import { parseExperience } from "./experience-parser";
import { SKILL_ALIASES } from "../skills/aliases";
import { normalizeSkill } from "../skills/normalize-skill";

export interface StructuredJD {
  roleTitle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minExperienceMonths: number | null;
  experienceText: string;
  responsibilities: string[];
  educationRequirement: string | null;
  keywords: string[];
  rawText: string;
}

/**
 * Parses raw job description text into structured requirements.
 */
export function parseJobDescription(rawText: string): StructuredJD {
  const normalizedText = (rawText || "").trim();

  // 1. Extract Role Title (first line or heading)
  const lines = normalizedText.split("\n").map((l) => l.trim()).filter(Boolean);
  const roleTitle = extractRoleTitle(lines);

  // 2. Extract Experience Requirement
  const parsedExp = parseExperience(normalizedText);
  const minExperienceMonths = parsedExp.normalizedMonths;

  // 3. Classify Skills into Required vs Preferred
  const { requiredSkills, preferredSkills } = classifyJdSkills(normalizedText);

  // 4. Extract Education requirements
  const educationRequirement = extractEducationRequirement(normalizedText);

  // 5. Extract domain keywords
  const keywords = extractKeywords(normalizedText);

  // 6. Extract responsibilities bullets
  const responsibilities = extractResponsibilities(normalizedText);

  return {
    roleTitle,
    requiredSkills,
    preferredSkills,
    minExperienceMonths,
    experienceText: parsedExp.rawValue || "",
    responsibilities,
    educationRequirement,
    keywords,
    rawText: normalizedText,
  };
}

function extractRoleTitle(lines: string[]): string {
  if (lines.length === 0) return "Target Position";
  const line0 = lines[0];
  if (line0.length < 60 && !/description|requirements|about us/i.test(line0)) {
    return line0.replace(/^(job|role|position)\s*(title|description)?:?\s*/i, "");
  }
  return "Software Engineering Role";
}

/**
 * Differentiates required skills (mandatory) vs preferred skills (optional).
 */
function classifyJdSkills(text: string): { requiredSkills: string[]; preferredSkills: string[] } {
  const requiredSet = new Set<string>();
  const preferredSet = new Set<string>();

  const lines = text.split("\n");
  let inPreferredSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const lowerLine = trimmed.toLowerCase();

    const isHeaderLine = trimmed.length < 50 || trimmed.endsWith(":");

    // Check if line is a preferred section header
    if (isHeaderLine && /^(preferred|nice\s+to\s+have|good\s+to\s+have|bonus|plus|desirable|optional)/i.test(trimmed)) {
      inPreferredSection = true;
      continue;
    }

    // Check if line is a required section header
    if (isHeaderLine && /^(required|must\s+have|mandatory|essential|minimum\s+qualifications|requirements)/i.test(trimmed)) {
      inPreferredSection = false;
      continue;
    }

    // Search skills in line
    for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
      const matchFound =
        containsSkill(trimmed, canonical) ||
        aliases.some((alias) => containsSkill(lowerLine, alias));

      if (matchFound) {
        if (inPreferredSection) {
          preferredSet.add(canonical);
        } else {
          requiredSet.add(canonical);
        }
      }
    }
  }

  // Remove preferred skills if they are already in required list
  for (const skill of requiredSet) {
    preferredSet.delete(skill);
  }

  return {
    requiredSkills: Array.from(requiredSet),
    preferredSkills: Array.from(preferredSet),
  };
}

function containsSkill(text: string, skill: string): boolean {
  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let prefix = "(?:^|[^a-zA-Z0-9+#])";
  if (skill.toLowerCase() === "js") {
    prefix = "(?:^|[^a-zA-Z0-9+#.])";
  }
  const regex = new RegExp(`${prefix}${escaped}(?:$|[^a-zA-Z0-9+#])`, "i");
  return regex.test(text);
}

function extractEducationRequirement(text: string): string | null {
  const eduRegex = /(bachelor'?s?|master'?s?|phd|degree\s+in\s+computer\s+science|b\.?s\.?|m\.?s\.?|computer\s+science\s+degree)/i;
  const match = text.match(eduRegex);
  return match ? match[0] : null;
}

function extractKeywords(text: string): string[] {
  const words = text
    .replace(/[^a-zA-Z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !isStopWord(w.toLowerCase()));

  const freqMap = new Map<string, number>();
  for (const w of words) {
    const norm = w.toLowerCase();
    freqMap.set(norm, (freqMap.get(norm) || 0) + 1);
  }

  return Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
}

function extractResponsibilities(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("•") || l.startsWith("-") || l.startsWith("*") || /^\d+\./.test(l))
    .map((l) => l.replace(/^[\s•\-\*\d\.]+/, "").trim())
    .filter((l) => l.length > 15);
}

function isStopWord(w: string): boolean {
  const stopWords = new Set([
    "with",
    "that",
    "this",
    "from",
    "have",
    "will",
    "your",
    "about",
    "more",
    "work",
    "team",
    "role",
    "position",
    "years",
    "must",
    "ability",
    "working",
    "experience",
    "required",
    "preferred",
  ]);
  return stopWords.has(w);
}

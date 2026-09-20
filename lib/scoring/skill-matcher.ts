import { SkillMatch, MatchStatus } from "@/types/analysis";
import { normalizeSkill } from "../skills/normalize-skill";
import { SKILL_ALIASES } from "../skills/aliases";

export interface SkillMatchingResult {
  matched: SkillMatch[];
  partial: SkillMatch[];
  missingRequired: string[];
  missingPreferred: string[];
  scorePercentage: number;
}

/**
 * Related technology clusters for explainable partial matching.
 * AWS != Azure, but both provide cloud infrastructure experience.
 */
const RELATED_CLUSTERS: Record<string, string[]> = {
  cloud: ["AWS", "Azure", "GCP"],
  relational_db: ["PostgreSQL", "MySQL"],
  nosql_db: ["MongoDB", "Redis"],
  frontend_framework: ["React", "Vue", "Angular", "Next.js"],
  backend_framework: ["Node.js", "Express.js", "Python", ".NET", "C#"],
  testing: ["Jest", "Vitest", "Playwright", "Cypress"],
};

/**
 * Matches candidate resume skills against job description required and preferred skills.
 */
export function matchSkills(
  resumeSkills: string[],
  jdRequiredSkills: string[],
  jdPreferredSkills: string[] = [],
  resumeText: string = ""
): SkillMatchingResult {
  const normalizedResumeSkills = new Set(
    resumeSkills.map((s) => normalizeSkill(s).canonical.toLowerCase())
  );

  const matched: SkillMatch[] = [];
  const partial: SkillMatch[] = [];
  const missingRequired: string[] = [];
  const missingPreferred: string[] = [];

  // 1. Process Required Skills
  for (const reqSkill of jdRequiredSkills) {
    const { canonical } = normalizeSkill(reqSkill);
    const lowerCanonical = canonical.toLowerCase();

    if (hasDirectMatch(lowerCanonical, normalizedResumeSkills)) {
      matched.push({
        name: reqSkill,
        canonicalName: canonical,
        status: "MATCHED",
        foundInResume: true,
        resumeContext: extractSnippet(resumeText, canonical),
        notes: `Direct skill match identified in resume.`,
      });
    } else {
      const partialCluster = findRelatedCluster(canonical, normalizedResumeSkills);
      if (partialCluster) {
        partial.push({
          name: reqSkill,
          canonicalName: canonical,
          status: "PARTIAL_MATCH",
          foundInResume: false,
          notes: `Resume demonstrates related ${partialCluster.clusterName} experience (${partialCluster.foundSkill}), though ${canonical} was specifically requested.`,
        });
      } else {
        missingRequired.push(canonical);
      }
    }
  }

  // 2. Process Preferred Skills
  for (const prefSkill of jdPreferredSkills) {
    const { canonical } = normalizeSkill(prefSkill);
    const lowerCanonical = canonical.toLowerCase();

    if (hasDirectMatch(lowerCanonical, normalizedResumeSkills)) {
      matched.push({
        name: prefSkill,
        canonicalName: canonical,
        status: "MATCHED",
        foundInResume: true,
        resumeContext: extractSnippet(resumeText, canonical),
        notes: `Preferred skill match identified in resume.`,
        isOptional: true,
      });
    } else {
      missingPreferred.push(canonical);
    }
  }

  // Calculate score percentage (required skills weighted 100%, partial 50%)
  const totalRequired = jdRequiredSkills.length;
  let scorePercentage = 100;

  if (totalRequired > 0) {
    const matchedCount = matched.filter((m) => !m.isOptional).length;
    const partialCount = partial.length;
    scorePercentage = Math.round(
      ((matchedCount + partialCount * 0.5) / totalRequired) * 100
    );
    scorePercentage = Math.min(100, Math.max(0, scorePercentage));
  }

  return {
    matched,
    partial,
    missingRequired,
    missingPreferred,
    scorePercentage,
  };
}

function hasDirectMatch(targetLower: string, resumeSkillsSet: Set<string>): boolean {
  if (resumeSkillsSet.has(targetLower)) return true;

  // Check aliases
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if (canonical.toLowerCase() === targetLower) {
      for (const alias of aliases) {
        if (resumeSkillsSet.has(alias.toLowerCase())) {
          return true;
        }
      }
    }
  }
  return false;
}

function findRelatedCluster(
  targetCanonical: string,
  resumeSkillsSet: Set<string>
): { clusterName: string; foundSkill: string } | null {
  for (const [clusterName, members] of Object.entries(RELATED_CLUSTERS)) {
    if (members.includes(targetCanonical)) {
      for (const member of members) {
        if (member !== targetCanonical && resumeSkillsSet.has(member.toLowerCase())) {
          return { clusterName: clusterName.replace("_", " "), foundSkill: member };
        }
      }
    }
  }
  return null;
}

function extractSnippet(text: string, term: string): string | undefined {
  if (!text) return undefined;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(term.toLowerCase());
  if (idx === -1) return undefined;

  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + term.length + 40);
  return "..." + text.substring(start, end).replace(/\s+/g, " ").trim() + "...";
}

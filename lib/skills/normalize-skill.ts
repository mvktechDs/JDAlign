import { SKILL_ALIASES } from "./aliases";

/**
 * Normalizes a raw skill string to its canonical display name if an alias is found.
 * Otherwise returns a cleaned version preserving key technology punctuation like C++, C#, .NET, Node.js, Next.js.
 */
export function normalizeSkill(rawSkill: string): { canonical: string; isKnown: boolean } {
  if (!rawSkill || typeof rawSkill !== "string") {
    return { canonical: "", isKnown: false };
  }

  const cleaned = rawSkill.trim();
  const lower = cleaned.toLowerCase();

  // 1. Direct match with canonical keys (case-insensitive)
  for (const canonicalKey of Object.keys(SKILL_ALIASES)) {
    if (canonicalKey.toLowerCase() === lower) {
      return { canonical: canonicalKey, isKnown: true };
    }
  }

  // 2. Alias search
  for (const [canonicalKey, aliases] of Object.entries(SKILL_ALIASES)) {
    for (const alias of aliases) {
      if (alias.toLowerCase() === lower) {
        return { canonical: canonicalKey, isKnown: true };
      }
    }
  }

  // 3. Clean up non-matched string while preserving important punctuation
  // Remove leading/trailing non-word chars except +, #, .
  const formatted = cleaned
    .replace(/^[^a-zA-Z0-9+#.]+|[^a-zA-Z0-9+#.]+$|/g, "")
    .trim();

  return { canonical: formatted || cleaned, isKnown: false };
}

/**
 * Normalizes an array of skills, removing duplicates.
 */
export function normalizeSkillList(skills: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const s of skills) {
    const { canonical } = normalizeSkill(s);
    if (canonical && !seen.has(canonical.toLowerCase())) {
      seen.add(canonical.toLowerCase());
      result.push(canonical);
    }
  }

  return result;
}

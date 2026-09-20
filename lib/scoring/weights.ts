export interface CategoryWeights {
  requiredSkills: number;
  experience: number;
  preferredSkills: number;
  responsibilities: number;
  projects: number;
  education: number;
}

export const BASE_WEIGHTS: CategoryWeights = {
  requiredSkills: 0.4,
  experience: 0.25,
  preferredSkills: 0.1,
  responsibilities: 0.1,
  projects: 0.1,
  education: 0.05,
};

export interface ApplicabilityFlags {
  hasRequiredSkills: boolean;
  hasExperienceReq: boolean;
  hasPreferredSkills: boolean;
  hasResponsibilities: boolean;
  hasProjects: boolean;
  hasEducationReq: boolean;
}

/**
 * Dynamically normalizes category weights when certain JD sections (e.g. Education, Preferred Skills) are missing.
 * Prevents penalizing candidates for criteria not requested in the Job Description.
 */
export function normalizeWeights(applicability: ApplicabilityFlags): CategoryWeights {
  let activeWeightSum = 0;

  const rawWeights: CategoryWeights = {
    requiredSkills: applicability.hasRequiredSkills ? BASE_WEIGHTS.requiredSkills : 0,
    experience: applicability.hasExperienceReq ? BASE_WEIGHTS.experience : 0,
    preferredSkills: applicability.hasPreferredSkills ? BASE_WEIGHTS.preferredSkills : 0,
    responsibilities: applicability.hasResponsibilities ? BASE_WEIGHTS.responsibilities : 0,
    projects: applicability.hasProjects ? BASE_WEIGHTS.projects : 0,
    education: applicability.hasEducationReq ? BASE_WEIGHTS.education : 0,
  };

  activeWeightSum =
    rawWeights.requiredSkills +
    rawWeights.experience +
    rawWeights.preferredSkills +
    rawWeights.responsibilities +
    rawWeights.projects +
    rawWeights.education;

  // Fallback if everything is 0
  if (activeWeightSum === 0) {
    return BASE_WEIGHTS;
  }

  return {
    requiredSkills: rawWeights.requiredSkills / activeWeightSum,
    experience: rawWeights.experience / activeWeightSum,
    preferredSkills: rawWeights.preferredSkills / activeWeightSum,
    responsibilities: rawWeights.responsibilities / activeWeightSum,
    projects: rawWeights.projects / activeWeightSum,
    education: rawWeights.education / activeWeightSum,
  };
}

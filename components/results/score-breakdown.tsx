import { ScoreSection } from "@/types/analysis";

interface ScoreBreakdownProps {
  breakdown: {
    requiredSkills: ScoreSection;
    experience: ScoreSection;
    preferredSkills: ScoreSection;
    responsibilities: ScoreSection;
    projects: ScoreSection;
    education: ScoreSection;
  };
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const sections = [
    { title: "Required Skills", key: "requiredSkills", data: breakdown.requiredSkills },
    { title: "Experience Duration", key: "experience", data: breakdown.experience },
    { title: "Preferred Skills", key: "preferredSkills", data: breakdown.preferredSkills },
    { title: "Responsibilities & Keywords", key: "responsibilities", data: breakdown.responsibilities },
    { title: "Project Relevance", key: "projects", data: breakdown.projects },
    { title: "Education Requirements", key: "education", data: breakdown.education },
  ];

  return (
    <div className="saas-card p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Score Section Breakdown</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Explainable section weights (Weights re-normalize if criteria omitted in JD).
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {sections.map((sec) => {
          const { score, effectiveWeight, applicable, explanation } = sec.data;
          const weightPercent = Math.round(effectiveWeight * 100);

          return (
            <div key={sec.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900">{sec.title}</span>
                  <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-mono">
                    Weight: {weightPercent}%
                  </span>
                  {!applicable && (
                    <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 font-mono font-medium">
                      Omitted in JD (Not Penalised)
                    </span>
                  )}
                </div>
                <span className="font-bold text-slate-900 font-mono">{score}%</span>
              </div>

              <div className="w-full h-2 bg-slate-100 rounded-md overflow-hidden border border-slate-200/80">
                <div
                  className="h-full bg-slate-900 transition-all duration-500 rounded-md"
                  style={{ width: `${score}%` }}
                />
              </div>

              <p className="text-xs text-slate-600 flex items-start gap-1.5 pt-0.5">
                <span className="text-slate-400">•</span> {explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}


import { ExperienceAnalysis } from "@/types/analysis";
import { Clock, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

interface ExperienceAnalysisProps {
  experience: ExperienceAnalysis;
}

export function ExperienceAnalysisComponent({ experience }: ExperienceAnalysisProps) {
  const {
    jdRequirementMonths,
    resumeMonths,
    differenceMonths,
    meetsRequirement,
    confidence,
    summary,
  } = experience;

  const formatMonths = (m: number | null) => {
    if (m === null) return "Not specified";
    if (m < 12) return `${m} months`;
    const yrs = (m / 12).toFixed(1).replace(/\.0$/, "");
    return `${yrs} yrs (${m} mos)`;
  };

  return (
    <div className="saas-card p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
          <Clock className="w-4 h-4 text-slate-700" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Experience Duration Analysis</h3>
          <p className="text-xs text-slate-500">
            Compares job minimum requirements against detected resume duration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
          <span className="text-xs text-slate-500 block mb-1 font-mono">JD Required</span>
          <span className="text-lg font-bold text-slate-900 font-mono">
            {formatMonths(jdRequirementMonths)}
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
          <span className="text-xs text-slate-500 block mb-1 font-mono">Resume Evidence</span>
          <span className="text-lg font-bold text-slate-900 font-mono">
            {formatMonths(resumeMonths)}
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
          <span className="text-xs text-slate-500 block mb-1 font-mono">Alignment Result</span>
          {meetsRequirement === true ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Requirement Met
            </span>
          ) : meetsRequirement === false ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" /> Shortfall (~{formatMonths(Math.abs(differenceMonths || 0))})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" /> Low Confidence
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-md border border-slate-200 leading-relaxed">
        {summary}
      </p>
    </div>
  );
}


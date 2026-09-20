import { ScoreLabel, MatchConfidence } from "@/types/analysis";
import { Award, ShieldCheck, CheckCircle2 } from "lucide-react";

interface OverallScoreProps {
  score: number;
  label: ScoreLabel;
  confidence: MatchConfidence;
  aiEnhanced: boolean;
  processingTimeMs: number;
}

export function OverallScore({
  score,
  label,
  confidence,
  aiEnhanced,
  processingTimeMs,
}: OverallScoreProps) {
  const getBadgeStyle = (s: number) => {
    if (s >= 90) return "bg-slate-900 text-white border-slate-900";
    if (s >= 80) return "bg-slate-900 text-white border-slate-900";
    if (s >= 70) return "bg-slate-900 text-white border-slate-900";
    if (s >= 60) return "bg-slate-900 text-white border-slate-900";
    return "bg-slate-900 text-white border-slate-900";
  };

  return (
    <div className="saas-card p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        {/* Score Badge Card */}
        <div
          className={`w-28 h-28 rounded-md bg-slate-900 border flex flex-col items-center justify-center shrink-0 shadow-xs text-white`}
        >
          <span className="text-4xl font-extrabold tracking-tight font-mono">
            {score}%
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mt-1 font-mono">
            Role Fit Score
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{label}</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono font-medium">
              Confidence: {confidence}
            </span>
          </div>

          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Derived deterministically from candidate skill alignment, experience duration, keyword coverage, project relevance, and education.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
            {aiEnhanced ? (
              <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" /> AI-Enhanced Analysis
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Deterministic Core Match
              </span>
            )}
            <span className="text-slate-500 font-mono">
              Processed in {(processingTimeMs / 1000).toFixed(2)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


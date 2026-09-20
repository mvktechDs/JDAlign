import { KeywordAnalysis } from "@/types/analysis";
import { Tag, Check, X } from "lucide-react";

interface KeywordAnalysisProps {
  keywordAnalysis: KeywordAnalysis;
}

export function KeywordAnalysisComponent({ keywordAnalysis }: KeywordAnalysisProps) {
  const { matchedKeywords, missingKeywords, totalJdKeywords, coveragePercentage } =
    keywordAnalysis;

  return (
    <div className="saas-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
            <Tag className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Keyword Alignment</h3>
            <p className="text-xs text-slate-500">
              Job description terminology detected in your resume text.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-bold text-slate-900 font-mono">{coveragePercentage}%</span>
          <span className="text-[11px] text-slate-500 block font-mono">Coverage</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-200 leading-relaxed">
        <strong>Tip:</strong> Use job-description terminology naturally and only when it accurately describes your real experience. Avoid artificial keyword stuffing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div>
          <h4 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2 font-mono">
            Matched Terms ({matchedKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {matchedKeywords.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
              >
                <Check className="w-3 h-3 text-emerald-600 shrink-0" /> {kw}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-red-800 uppercase tracking-wider mb-2 font-mono">
            Missing Terms ({missingKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.map((kw, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs font-medium"
              >
                <X className="w-3 h-3 text-red-600 shrink-0" /> {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


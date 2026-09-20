import { Insight } from "@/types/analysis";
import { AlertTriangle } from "lucide-react";

interface GapsProps {
  gaps: Insight[];
}

export function Gaps({ gaps }: GapsProps) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="saas-card p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Identified Resume Gaps ({gaps.length})
          </h3>
          <p className="text-xs text-slate-500">
            Areas where resume evidence falls short of JD expectations.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {gaps.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-900">{item.title}</span>
              {item.severity && (
                <span
                  className={`text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded-md border ${
                    item.severity === "high"
                      ? "bg-red-50 text-red-800 border-red-200"
                      : item.severity === "medium"
                      ? "bg-slate-200 text-slate-800 border-slate-300"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {item.severity} severity
                </span>
              )}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{item.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


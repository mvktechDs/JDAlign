import { Insight } from "@/types/analysis";
import { Check, ShieldCheck } from "lucide-react";

interface StrengthsProps {
  strengths: Insight[];
}

export function Strengths({ strengths }: StrengthsProps) {
  if (!strengths || strengths.length === 0) return null;

  return (
    <div className="saas-card p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Candidate Strengths ({strengths.length})
          </h3>
          <p className="text-xs text-slate-500">
            Validated evidence matching target job requirements.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {strengths.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-1.5"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{item.title}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{item.explanation}</p>
            {item.evidence && (
              <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-md border border-slate-200/60 font-mono">
                Evidence: {item.evidence}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


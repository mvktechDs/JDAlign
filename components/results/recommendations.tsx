"use client";

import { useState } from "react";
import { Recommendation } from "@/types/analysis";
import { Lightbulb, Copy, Check, ArrowRight } from "lucide-react";

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export function Recommendations({ recommendations }: RecommendationsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="saas-card p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Actionable Recommendations</h3>
            <p className="text-xs text-slate-500">
              Categorized, safe suggestions to enhance job alignment.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isCopied = copiedId === rec.id;
          const copyContent = rec.suggestedRewrite
            ? `${rec.recommendation}\nSuggested Bullet: "${rec.suggestedRewrite}"`
            : rec.recommendation;

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-md border transition-colors ${
                rec.category === "NEVER_FABRICATE"
                  ? "bg-red-50/60 border-red-200"
                  : rec.category === "ONLY_ADD_IF_TRUE"
                  ? "bg-slate-50 border-slate-200"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm">{rec.title}</span>
                  <span
                    className={`text-[10px] uppercase font-mono font-semibold px-2.5 py-0.5 rounded-md border ${
                      rec.category === "NEVER_FABRICATE"
                        ? "bg-red-100 text-red-900 border-red-300"
                        : rec.category === "ONLY_ADD_IF_TRUE"
                        ? "bg-slate-200 text-slate-800 border-slate-300"
                        : "bg-slate-200 text-slate-800 border-slate-300"
                    }`}
                  >
                    {rec.category.replace(/_/g, " ")}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(rec.id, copyContent)}
                  className="btn-secondary text-xs py-1 px-2.5 shrink-0"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" /> Copy
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed mb-2">
                {rec.recommendation}
              </p>

              {rec.originalBullet && rec.suggestedRewrite && (
                <div className="mt-3 p-3.5 rounded-md bg-white border border-slate-200 space-y-2 text-xs shadow-xs">
                  <div className="text-slate-600 flex items-start gap-1.5 font-mono">
                    <span className="text-red-700 font-semibold shrink-0">Original:</span>
                    <span>"{rec.originalBullet}"</span>
                  </div>
                  <div className="text-slate-900 flex items-start gap-1.5 font-medium font-mono">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900 font-bold">Suggested:</strong> "
                      {rec.suggestedRewrite}"
                    </span>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-500 mt-2 font-mono">Reason: {rec.reason}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}


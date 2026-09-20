"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

const STAGES = [
  "Reading & parsing resume document...",
  "Extracting work experience & technical skills...",
  "Parsing job description requirements...",
  "Comparing technologies & normalizing weights...",
  "Calculating explainable match score...",
  "Enriching with privacy-conscious recommendations...",
];

export function AnalysisProgress() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="saas-card p-8 text-center max-w-lg mx-auto space-y-6">
      <div className="w-12 h-12 rounded-md bg-slate-900 border border-slate-900 flex items-center justify-center mx-auto text-white shadow-xs">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-1.5">
          Analyzing Role Fit...
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          Running deterministic scoring engine and AI recommendation layer.
        </p>
      </div>

      <div className="space-y-2.5 text-left bg-slate-50 p-4 rounded-md border border-slate-200">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;
          return (
            <div key={idx} className="flex items-center gap-3 text-xs font-mono">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-slate-900 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              )}
              <span
                className={
                  isDone
                    ? "text-slate-500 line-through opacity-70 font-sans text-xs"
                    : isCurrent
                    ? "text-slate-900 font-semibold font-sans text-xs"
                    : "text-slate-400 font-sans text-xs"
                }
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


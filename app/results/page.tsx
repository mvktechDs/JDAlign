"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnalysisResult } from "@/types/analysis";
import { OverallScore } from "@/components/results/overall-score";
import { ScoreBreakdown } from "@/components/results/score-breakdown";
import { MatchedSkills } from "@/components/results/matched-skills";
import { PartialSkills } from "@/components/results/partial-skills";
import { MissingSkills } from "@/components/results/missing-skills";
import { ExperienceAnalysisComponent } from "@/components/results/experience-analysis";
import { Strengths } from "@/components/results/strengths";
import { Gaps } from "@/components/results/gaps";
import { Recommendations } from "@/components/results/recommendations";
import { KeywordAnalysisComponent } from "@/components/results/keyword-analysis";
import { HonestGuidance } from "@/components/results/honest-guidance";
import { FileSearch, ArrowLeft, AlertCircle, Info, RefreshCw, Trash2 } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("jdalign_last_result") || sessionStorage.getItem("rolefit_last_result");
      if (stored) {
        setResult(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load result from sessionStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearSession = () => {
    try {
      sessionStorage.removeItem("jdalign_last_result");
      sessionStorage.removeItem("rolefit_last_result");
    } catch (e) {
      console.error("Failed to clear sessionStorage", e);
    }
    router.push("/analyze");
  };


  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-500 font-mono text-xs">
        <p>Loading analysis dashboard...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="py-20 max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="w-12 h-12 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500 shadow-xs">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1.5">No Active Analysis Found</h2>
          <p className="text-sm text-slate-600">
            You haven't submitted a resume for analysis yet, or your session state expired.
          </p>
        </div>
        <Link
          href="/analyze"
          className="btn-primary inline-flex text-sm py-2.5 px-5"
        >
          <FileSearch className="w-4 h-4" /> Go to Resume Analyzer
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Analyzer
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Role Fit Analysis Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">
            Analyzed at {new Date(result.metadata.analyzedAt).toLocaleString()} • Request ID: {result.metadata.requestId}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleClearSession}
            className="btn-secondary text-xs py-2 px-3 hover:text-red-700 hover:border-red-200"
            title="Clear stored analysis from browser session"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" /> Clear Session
          </button>

          <Link
            href="/analyze"
            className="btn-secondary text-xs py-2 px-3"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Analyze Another Role
          </Link>
        </div>
      </div>

      {/* Mandatory User Disclaimer */}
      <div className="p-4 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed font-sans">
          <strong className="font-semibold text-slate-900">Disclaimer:</strong> JDAlign provides resume-to-job alignment guidance and does not predict or guarantee hiring outcomes. Always verify AI-generated suggestions before updating your resume.
        </div>

      </div>

      {/* Overall Score Banner */}
      <OverallScore
        score={result.overallScore}
        label={result.scoreLabel}
        confidence={result.confidence}
        aiEnhanced={result.metadata.aiEnhanced}
        processingTimeMs={result.metadata.processingTimeMs}
      />

      {/* AI Fallback Notice if AI was unavailable */}
      {result.metadata.aiError && (
        <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            Core analysis completed. AI-enhanced recommendations are temporarily unavailable. Displaying deterministic fallback recommendations.
          </span>
        </div>
      )}

      {/* Score Breakdown & Skills Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ScoreBreakdown breakdown={result.breakdown} />
          <MatchedSkills skills={result.matchedSkills} />
          <PartialSkills skills={result.partialSkills} />
          <MissingSkills
            missingRequired={result.missingRequiredSkills}
            missingPreferred={result.missingPreferredSkills}
          />
          <ExperienceAnalysisComponent experience={result.experienceAnalysis} />
          <KeywordAnalysisComponent keywordAnalysis={result.keywordAnalysis} />
        </div>

        <div className="space-y-8">
          <Strengths strengths={result.strengths} />
          <Gaps gaps={result.gaps} />
        </div>
      </div>

      {/* Recommendations & Honest Guidance */}
      <Recommendations recommendations={result.recommendations} />
      <HonestGuidance guidance={result.honestGuidance} />
    </div>
  );
}


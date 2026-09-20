"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResumeUploader } from "@/components/analyzer/resume-uploader";
import { JDInput } from "@/components/analyzer/jd-input";
import { AnalysisProgress } from "@/components/analyzer/analysis-progress";
import { FileSearch, AlertCircle, ShieldCheck } from "lucide-react";
import { ApiResponse } from "@/types/api";

export default function AnalyzePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setErrorMessage(null);

    if (!file) {
      setErrorMessage("Please upload a valid PDF or DOCX resume document.");
      return;
    }

    if (!jobDescription.trim() || jobDescription.trim().length < 150) {
      setErrorMessage("Please provide a job description of at least 150 characters.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const json: ApiResponse = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(
          json.success === false
            ? json.error.message
            : "Failed to analyze resume. Please try again."
        );
      }

      // Store typed result in sessionStorage for zero database privacy
      sessionStorage.setItem("jdalign_last_result", JSON.stringify(json.data));

      // Navigate to /results dashboard
      router.push("/results");

    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during analysis.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <div className="saas-badge inline-flex items-center gap-1.5 mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
          <span>Stateless Analysis • Zero Disk Storage</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Analyze Resume vs Job Description
        </h1>

        <p className="text-sm sm:text-base text-slate-600">
          Upload your resume and paste the job description to calculate an explainable match score and receive honest recommendations.
        </p>
      </div>

      {isAnalyzing ? (
        <AnalysisProgress />
      ) : (
        <div className="saas-card p-6 sm:p-10 space-y-8 max-w-5xl mx-auto">
          {errorMessage && (
            <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div>
                <strong className="font-semibold text-red-800">Analysis Error:</strong> {errorMessage}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResumeUploader file={file} onFileSelect={setFile} />
            <JDInput value={jobDescription} onChange={setJobDescription} />
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0" />
              Files are parsed in memory and released immediately. No raw resume logged.
            </p>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!file || jobDescription.trim().length < 150}
              className="w-full sm:w-auto btn-primary py-2.5 px-6"
            >
              <FileSearch className="w-4 h-4" />
              <span>Analyze Role Fit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


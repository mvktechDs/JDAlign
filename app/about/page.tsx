import { APP_NAME, APP_SUBTITLE } from "@/lib/config/app";
import { Cpu, ShieldCheck, Scale, Server } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          About {APP_NAME}
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          {APP_SUBTITLE} — Privacy-conscious explainable role-fit analysis.
        </p>
      </div>

      <div className="saas-card p-6 sm:p-8 space-y-6 text-sm text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-slate-900" />
            The Core Product Principle
          </h2>
          <p>
            Most AI resume checkers send raw resumes to an LLM with a basic prompt like <em>"Rate this resume for this JD"</em> and output an unexplainable number like "83% Match".
          </p>
          <p className="font-semibold text-slate-900">
            {APP_NAME} rejects black-box scoring.
          </p>
          <p>
            Instead, we parse resumes and job descriptions into structured data structures, execute a 100% deterministic matching engine with dynamic weight normalization, and use AI purely as an enhancement layer for contextual recommendations.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="bg-slate-50 p-5 rounded-md border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-700" />
              1. Deterministic Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluates Required Skills (40%), Experience (25%), Preferred Skills (10%), Responsibilities (10%), Projects (10%), and Education (5%). Works 100% offline without AI.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-md border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              2. Privacy & Redaction
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All candidate personal info is scrubbed before passing context to Google Gemini AI API endpoints. No database required.
            </p>
          </div>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-slate-900" />
            Single Next.js Full-Stack Architecture
          </h2>
          <p>
            {APP_NAME} runs entirely as a single unified Next.js 15 App Router application on Vercel's serverless offering. Frontend UI, Node.js route handlers, document parsers, scoring calculations, and AI provider calls exist within a single clean codebase.
          </p>

        </section>
      </div>
    </div>
  );
}


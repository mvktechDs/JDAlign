import Link from "next/link";
import { FileSearch, ArrowRight, ShieldCheck, Cpu, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-16 pb-20 overflow-hidden bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-mono mb-6 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
          <span>Deterministic Engine • PII Redacted</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Evaluate resume alignment with target job requirements.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Compare your resume against any job description to receive an explainable match score, skill-gap breakdown, and actionable suggestions.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/analyze"
            className="w-full sm:w-auto btn-primary text-sm px-5 py-2.5"
          >
            <FileSearch className="w-4 h-4" />
            <span>Analyze Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto btn-secondary text-sm px-5 py-2.5"
          >
            <span>See How It Works</span>
          </a>
        </div>

        {/* Human Value Props */}
        <div className="mt-14 pt-8 border-t border-slate-200 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-left text-xs">
          <div className="flex items-center gap-2 bg-white p-3 rounded-md border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
            <span className="font-medium text-slate-800">Deterministic Engine</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 rounded-md border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
            <span className="font-medium text-slate-800">PII Redacted Privacy</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 rounded-md border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
            <span className="font-medium text-slate-800">Ethical Framework</span>
          </div>
          <div className="flex items-center gap-2 bg-white p-3 rounded-md border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0" />
            <span className="font-medium text-slate-800">Offline Fallback Engine</span>
          </div>
        </div>
      </div>
    </section>
  );
}

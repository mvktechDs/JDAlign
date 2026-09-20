import Link from "next/link";
import { FileSearch, ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="saas-card bg-slate-50/50 p-10 sm:p-14 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            Ready to analyze your resume match?
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Upload your resume and paste a target job description to get an explainable match score and honest improvement recommendations in seconds.
          </p>

          <div>
            <Link
              href="/analyze"
              className="btn-primary inline-flex text-sm py-2.5 px-5"
            >
              <FileSearch className="w-4 h-4" />
              <span>Start Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


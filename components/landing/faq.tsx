"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      q: "How is the match score calculated?",
      a: "The score (0-100) is calculated deterministically by evaluating 6 sections: Required Skills (40%), Experience (25%), Preferred Skills (10%), Responsibilities/Keywords (10%), Project Relevance (10%), and Education (5%). If a job description omits education or explicit minimum experience, active weights re-normalize proportionally so you are not penalized.",
    },
    {
      q: "Is my resume stored or used to train AI models?",
      a: "No. JDAlign is stateless and contains no database. Original resume documents are never stored on disk. Personal Identifiable Information (PII) like emails, phone numbers, and portfolio links are redacted before sending data to Gemini.",
    },
    {
      q: "Does JDAlign encourage resume fabrication?",
      a: "Never. Ethical integrity is a core principle. If a skill is missing from your resume, it is explicitly reported as missing. Recommendations are categorized into 'Safe to Improve', 'Only Add If True', and 'Never Fabricate'.",
    },
    {
      q: "What happens if Gemini AI is down or rate-limited?",
      a: "JDAlign is designed with an offline-first fallback architecture. The deterministic matching engine, skill extraction, experience gap analysis, and rule-based recommendations remain fully functional even if AI is completely unavailable.",
    },

    {
      q: "Which file formats are supported?",
      a: "We support PDF (.pdf) and Microsoft Word (.docx) documents up to 2 MB.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="saas-badge mb-3">
            Questions & Answers
          </span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="saas-card overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-slate-700 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-slate-900" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


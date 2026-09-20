import { UploadCloud, Cpu, Award } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload Resume & Job Description",
      description:
        "Drop your PDF or DOCX resume and paste the target job description. Files are parsed in memory and released immediately.",
      icon: UploadCloud,
    },
    {
      num: "02",
      title: "Deterministic Match Calculation",
      description:
        "Our engine extracts structured skills, experience duration, and keyword patterns. Weights dynamically normalize if fields are omitted.",
      icon: Cpu,
    },
    {
      num: "03",
      title: "Explainable Insights & Guidance",
      description:
        "Receive clear subcategory scores, skill gaps, and categorized improvement recommendations that never tell you to fabricate experience.",
      icon: Award,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 block">
            Architecture Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How JDAlign Works
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            JDAlign separates deterministic algorithmic scoring from AI contextual analysis to ensure 100% explainability.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

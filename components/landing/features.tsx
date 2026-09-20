import { ShieldAlert, BarChart3, Lock, CheckCircle, Scale, Sparkles } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Explainable Match Scoring",
      description:
        "Score range 0-100 derived from 6 distinct weighted sections (Required Skills 40%, Experience 25%, Preferred Skills 10%, Responsibilities 10%, Projects 10%, Education 5%).",
      icon: BarChart3,
    },
    {
      title: "Dynamic Weight Normalization",
      description:
        "If a job description omits education or explicit minimum experience, weights dynamically re-balance so candidate scores are never penalised for missing requirements.",
      icon: Scale,
    },
    {
      title: "Strict PII Redaction",
      description:
        "Emails, phone numbers, portfolio links, street addresses, and detected names are scrubbed server-side before external AI enrichment.",
      icon: Lock,
    },
    {
      title: "Honest Resume Guidance",
      description:
        "Recommendations are categorized into Safe to Improve, Only Add If True, and Never Fabricate. We never urge candidates to lie.",
      icon: ShieldAlert,
    },
    {
      title: "Resilient Offline Fallback",
      description:
        "If Gemini is rate-limited, unconfigured, or times out, the deterministic engine still returns complete scores, skill gaps, and rule-based recommendations.",
      icon: CheckCircle,
    },
    {
      title: "Single Full-Stack Architecture",
      description:
        "No separate Node/Express backend or database required. Entire application executes statelessly within serverless request lifecycles.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 block">
            Engine Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Engine Architecture & Ethics
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs"
              >
                <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

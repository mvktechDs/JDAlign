import { XCircle, HelpCircle } from "lucide-react";

interface MissingSkillsProps {
  missingRequired: string[];
  missingPreferred: string[];
}

export function MissingSkills({ missingRequired, missingPreferred }: MissingSkillsProps) {
  const hasMissing = missingRequired.length > 0 || missingPreferred.length > 0;

  return (
    <div className="saas-card p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
          <XCircle className="w-4 h-4 text-red-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Missing Skills Analysis
          </h3>
          <p className="text-xs text-slate-500">
            Skills requested by job description not detected in resume text.
          </p>
        </div>
      </div>

      {!hasMissing ? (
        <div className="p-4 rounded-md bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium">
          ✓ Outstanding alignment! All major requested technologies were identified in your resume.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3.5 rounded-md bg-red-50/70 border border-red-200 text-xs text-red-900">
            <span className="font-semibold text-red-950">Ethical Integrity Notice:</span> These requirements were not identified in your resume. Only add them if you genuinely have relevant hands-on experience.
          </div>

          {missingRequired.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-red-700 mb-2 font-mono">
                Missing Required Skills ({missingRequired.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingRequired.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs font-medium"
                  >
                    <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {missingPreferred.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                Missing Preferred Skills ({missingPreferred.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingPreferred.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {skill} (Optional)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


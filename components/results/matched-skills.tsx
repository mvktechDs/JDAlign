import { SkillMatch } from "@/types/analysis";
import { CheckCircle2 } from "lucide-react";

interface MatchedSkillsProps {
  skills: SkillMatch[];
}

export function MatchedSkills({ skills }: MatchedSkillsProps) {
  return (
    <div className="saas-card p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Matched Skills ({skills.length})
          </h3>
          <p className="text-xs text-slate-500">
            Identified directly in your resume or canonical skill aliases.
          </p>
        </div>
      </div>

      {skills.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No direct skill matches identified.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{skill.canonicalName || skill.name}</span>
              {skill.isOptional && (
                <span className="text-[9px] uppercase px-1 py-0.2 bg-slate-200 text-slate-700 rounded font-mono font-semibold">
                  Preferred
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


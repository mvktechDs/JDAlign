import { SkillMatch } from "@/types/analysis";
import { AlertCircle } from "lucide-react";

interface PartialSkillsProps {
  skills: SkillMatch[];
}

export function PartialSkills({ skills }: PartialSkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="saas-card p-6 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Related / Partial Skill Experience ({skills.length})
          </h3>
          <p className="text-xs text-slate-500">
            Demonstrates related technology domain experience or partial term overlap.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {skills.map((skill, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-800"
          >
            <div className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {skill.canonicalName || skill.name}
            </div>
            <p className="text-slate-600 leading-relaxed">{skill.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


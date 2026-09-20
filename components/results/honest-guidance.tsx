import { ShieldCheck, AlertCircle, Ban } from "lucide-react";

interface HonestGuidanceProps {
  guidance: {
    safeToImprove: string[];
    onlyAddIfTrue: string[];
    neverFabricate: string[];
  };
}

export function HonestGuidance({ guidance }: HonestGuidanceProps) {
  const { safeToImprove, onlyAddIfTrue, neverFabricate } = guidance;

  return (
    <div className="saas-card p-6 sm:p-8 space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-xs font-mono">
            JDA
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Honest Career Guidance</h3>
            <p className="text-xs text-slate-500">
              Ethical resume alignment framework. JDAlign strictly opposes credentials fabrication.
            </p>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SAFE TO IMPROVE */}
        <div className="bg-slate-50 p-5 rounded-md border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SAFE TO IMPROVE</span>
          </div>
          <p className="text-xs text-slate-600">
            Optimizations that clarify existing experience without adding false information.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            {safeToImprove.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
            <li className="flex items-start gap-1.5 text-slate-500">
              <span>•</span> Move important real skills higher up on your resume.
            </li>
            <li className="flex items-start gap-1.5 text-slate-500">
              <span>•</span> Highlight real hands-on projects that used requested tools.
            </li>
          </ul>
        </div>

        {/* ONLY ADD IF TRUE */}
        <div className="bg-slate-50 p-5 rounded-md border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs font-mono">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>ONLY ADD IF TRUE</span>
          </div>
          <p className="text-xs text-slate-600">
            Requirements you should list strictly IF AND ONLY IF you genuinely possess them.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            {onlyAddIfTrue.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-slate-900 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
            <li className="flex items-start gap-1.5 text-slate-500">
              <span>•</span> Unmentioned cloud platforms or DevOps tools.
            </li>
            <li className="flex items-start gap-1.5 text-slate-500">
              <span>•</span> Exact impact metrics and team leadership roles.
            </li>
          </ul>
        </div>

        {/* NEVER FABRICATE */}
        <div className="bg-red-50/60 p-5 rounded-md border border-red-200 space-y-3">
          <div className="flex items-center gap-2 text-red-900 font-bold text-xs font-mono">
            <Ban className="w-4 h-4 text-red-600" />
            <span>NEVER FABRICATE</span>
          </div>
          <p className="text-xs text-slate-600">
            Strict prohibitions. Fabricated credentials degrade interview performance.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            {neverFabricate.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-red-600 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


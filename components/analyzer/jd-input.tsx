"use client";

import { FileText, Trash2, AlertCircle } from "lucide-react";

interface JDInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

const SAMPLE_JD = `Full Stack Engineer (Next.js & Node.js)

About the Role:
We are looking for a Senior Full Stack Engineer with 2+ years of experience building modern web applications.

Required Skills & Experience:
- 2+ years of software development experience.
- Strong proficiency in React, Next.js, TypeScript, and Node.js.
- Experience designing and consuming REST APIs.
- Proficiency with relational databases such as PostgreSQL or MySQL.
- Experience with version control using Git.

Preferred Skills:
- Experience with Docker containers and cloud deployment (AWS or Vercel).
- Knowledge of Tailwind CSS and modern UI design principles.

Responsibilities:
- Architect and maintain scalable full-stack web applications.
- Collaborate with product and design teams to deliver exceptional user experiences.
- Optimize frontend rendering and API performance.`;

export function JDInput({ value, onChange, error }: JDInputProps) {
  const minLength = 150;
  const maxLength = 20000;
  const currentLength = value.length;
  const isTooShort = currentLength > 0 && currentLength < minLength;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-900">
          Target Job Description <span className="text-red-500">*</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(SAMPLE_JD)}
            className="btn-secondary text-xs py-1 px-2.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" /> Load Sample JD
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 px-2 py-1 transition-colors font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={10}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the target job description here (responsibilities, required skills, preferred qualifications)..."
          maxLength={maxLength}
          className="w-full bg-white border border-slate-300 rounded-md p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all resize-y shadow-xs"
        />

        <div className="absolute bottom-3 right-4 text-xs font-mono text-slate-400 pointer-events-none bg-white/90 px-1 rounded">
          <span className={isTooShort ? "text-amber-600 font-semibold" : ""}>
            {currentLength.toLocaleString()}
          </span>{" "}
          / {maxLength.toLocaleString()} chars
        </div>
      </div>

      {isTooShort && (
        <p className="text-xs text-amber-800 flex items-center gap-1.5 bg-amber-50 p-2.5 rounded-md border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          Recommended minimum length: 150 characters for accurate matching.
        </p>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 p-2.5 rounded-md border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}


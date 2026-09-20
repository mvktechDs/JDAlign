import { ShieldCheck, Database, Lock, Eye, AlertTriangle } from "lucide-react";
import { APP_NAME } from "@/lib/config/app";

export default function PrivacyPage() {
  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <div className="saas-badge inline-flex items-center gap-1.5 mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
          <span>Privacy & Data Ethics</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Privacy Policy & Disclosures
        </h1>

        <p className="text-sm text-slate-600">
          How {APP_NAME} handles candidate document data, PII redaction, and third-party AI processing.
        </p>
      </div>

      <div className="saas-card p-6 sm:p-8 space-y-6 text-sm text-slate-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-slate-900" />
            1. Zero Database Infrastructure
          </h2>
          <p>
            {APP_NAME} does not use PostgreSQL, MongoDB, Supabase, or any persistent database storage. We require zero candidate accounts. Your document is processed transiently in server memory during the analysis request and is immediately released.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-900" />
            2. Server-Side PII Redaction
          </h2>
          <p>
            Before sending resume content to our external AI provider, automated algorithms scrub identifiable Personal Identifiable Information (PII), including:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2 text-xs font-mono">
            <li>Email addresses (<code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">[EMAIL_REDACTED]</code>)</li>
            <li>Phone numbers (<code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">[PHONE_REDACTED]</code>)</li>
            <li>LinkedIn, GitHub, and portfolio URLs (<code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">[URL_REDACTED]</code>)</li>
            <li>Street addresses (<code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">[ADDRESS_REDACTED]</code>)</li>
            <li>Candidate name header (<code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded border border-slate-200">[NAME_REDACTED]</code>)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-slate-900" />
            3. Third-Party AI Provider Disclosure
          </h2>
          <p>
            We do not claim that "your data never leaves our servers." AI recommendations use Google Gemini API endpoints. While PII is scrubbed before transmission, redacted resume text and job description content are processed by Google's API infrastructure under serverless request limits.
          </p>
        </section>

        <section className="space-y-2.5 bg-amber-50/70 p-4 rounded-md border border-amber-200">
          <h2 className="text-sm font-bold text-amber-950 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            4. Limitation of Automated Redaction
          </h2>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            Automated pattern matching is imperfect. Redacted text may still contain contextual clues (such as specific employer names or unique project descriptions). We encourage candidates to strip highly confidential information from documents prior to uploading.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900">5. Logging & Diagnostics</h2>
          <p>
            Our server logs record anonymous telemetry metrics strictly necessary for operations: request duration (ms), file size (bytes), document format (pdf/docx), request ID, and score values. We strictly do NOT log raw resume content, job description text, or API secrets.
          </p>
        </section>
      </div>
    </div>
  );
}


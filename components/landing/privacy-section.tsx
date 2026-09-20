import { ShieldCheck, Database, FileText, Lock } from "lucide-react";

export function PrivacySection() {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 p-8 sm:p-10 rounded-lg border border-slate-200">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-mono mb-4 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              <span>Privacy & Security</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
              Your resume data is parsed in memory and released immediately.
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              JDAlign requires zero candidate accounts, zero database infrastructure, and zero permanent resume storage. When you analyze a document, it is parsed in server memory for milliseconds, scored, and immediately released.
            </p>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <Database className="w-4 h-4 text-slate-700 mb-2" />
                <h3 className="font-semibold text-slate-900 text-xs">Zero Database Storage</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Stateless design with zero PostgreSQL, MongoDB, or external user tracking.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <Lock className="w-4 h-4 text-slate-700 mb-2" />
                <h3 className="font-semibold text-slate-900 text-xs">PII Redaction</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Emails, phones, links, and names scrubbed before external AI API calls.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                <FileText className="w-4 h-4 text-slate-700 mb-2" />
                <h3 className="font-semibold text-slate-900 text-xs">No Document Logging</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Server logs record only anonymous telemetry metrics (duration, size, ID).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

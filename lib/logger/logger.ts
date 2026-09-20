/**
 * Safe structured logger for RoleFit AI server events.
 * STRICT SECURITY REQUIREMENT: Never log raw resume, JD text, PII, or API keys.
 */
export interface SafeLogMeta {
  requestId?: string;
  event: string;
  durationMs?: number;
  fileType?: string;
  fileSizeBytes?: number;
  aiEnhanced?: boolean;
  score?: number;
  status?: string;
  error?: string;
  [key: string]: unknown;
}

export const logger = {
  info(meta: SafeLogMeta): void {
    const timestamp = new Date().toISOString();
    console.log(
      JSON.stringify({
        level: "INFO",
        timestamp,
        ...sanitizeMeta(meta),
      })
    );
  },

  warn(meta: SafeLogMeta): void {
    const timestamp = new Date().toISOString();
    console.warn(
      JSON.stringify({
        level: "WARN",
        timestamp,
        ...sanitizeMeta(meta),
      })
    );
  },

  error(meta: SafeLogMeta): void {
    const timestamp = new Date().toISOString();
    console.error(
      JSON.stringify({
        level: "ERROR",
        timestamp,
        ...sanitizeMeta(meta),
      })
    );
  },
};

function sanitizeMeta(meta: SafeLogMeta): SafeLogMeta {
  const sanitized: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(meta)) {
    // Exclude raw texts, tokens, keys
    if (
      /resume|jd|text|prompt|key|secret|email|phone|password|token/i.test(key) &&
      typeof val === "string" &&
      val.length > 30
    ) {
      sanitized[key] = "[SANITIZED]";
    } else {
      sanitized[key] = val;
    }
  }

  return sanitized as SafeLogMeta;
}

import { z } from "zod";

const envSchema = z.object({
  AI_PROVIDER: z.string().default("gemini"),
  GEMINI_API_KEY: z.string().optional().default(""),
  GEMINI_MODEL: z.string().default("gemini-3.6-flash"),
  MAX_FILE_SIZE_MB: z.coerce.number().default(2),
  ANALYSIS_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().default(15),
  ANALYSIS_RATE_LIMIT_MAX: z.coerce.number().default(10),
  AI_TIMEOUT_MS: z.coerce.number().default(25000),
  NEXT_PUBLIC_APP_NAME: z.string().default("JDAlign"),

});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const result = envSchema.safeParse({
    AI_PROVIDER: process.env.AI_PROVIDER,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
    MAX_FILE_SIZE_MB: process.env.MAX_FILE_SIZE_MB,
    ANALYSIS_RATE_LIMIT_WINDOW_MINUTES:
      process.env.ANALYSIS_RATE_LIMIT_WINDOW_MINUTES,
    ANALYSIS_RATE_LIMIT_MAX: process.env.ANALYSIS_RATE_LIMIT_MAX,
    AI_TIMEOUT_MS: process.env.AI_TIMEOUT_MS,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  });

  if (!result.success) {
    console.warn("Invalid environment variables, using safe defaults", result.error.format());
    return envSchema.parse({});
  }

  return result.data;
}

export const env = getEnv();

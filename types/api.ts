import { AnalysisResult } from "./analysis";

export type ApiErrorCode =
  | "INVALID_FILE"
  | "FILE_TOO_LARGE"
  | "UNSUPPORTED_FILE_TYPE"
  | "EMPTY_RESUME"
  | "RESUME_PARSE_FAILED"
  | "INVALID_JOB_DESCRIPTION"
  | "RATE_LIMITED"
  | "AI_TIMEOUT"
  | "ANALYSIS_FAILED"
  | "INTERNAL_ERROR";

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: string;
  };
  requestId: string;
}

export interface ApiSuccessResponse {
  success: true;
  data: AnalysisResult;
  requestId: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

export interface HealthResponse {
  status: "ok" | "degraded" | "error";
  service: string;
  timestamp: string;
  version: string;
}

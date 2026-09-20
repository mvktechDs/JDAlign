import { NextRequest, NextResponse } from "next/server";
import { generateRequestId } from "@/lib/security/request-id";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { analyzeResumeAndJD } from "@/lib/analysis/analysis.service";
import { ApiErrorResponse, ApiSuccessResponse, ApiErrorCode } from "@/types/api";
import { logger } from "@/lib/logger/logger";
import { env } from "@/lib/config/env";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const requestId = generateRequestId();

  // 1. Rate Limiting Check
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const rateLimit = checkRateLimit(
    clientIp,
    env.ANALYSIS_RATE_LIMIT_MAX,
    env.ANALYSIS_RATE_LIMIT_WINDOW_MINUTES
  );

  if (!rateLimit.allowed) {
    logger.warn({
      requestId,
      event: "rate_limit_exceeded",
      clientIp,
    });

    const errorResp: ApiErrorResponse = {
      success: false,
      error: {
        code: "RATE_LIMITED",
        message: `Too many analysis requests. Please try again in ${Math.ceil(
          rateLimit.resetInSeconds / 60
        )} minutes.`,
      },
      requestId,
    };

    return NextResponse.json(errorResp, {
      status: 429,
      headers: {
        "X-Request-ID": requestId,
        "Retry-After": String(rateLimit.resetInSeconds),
      },
    });
  }

  try {
    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!resumeFile) {
      const errorResp: ApiErrorResponse = {
        success: false,
        error: {
          code: "INVALID_FILE",
          message: "Please upload a PDF or DOCX resume document.",
        },
        requestId,
      };
      return NextResponse.json(errorResp, { status: 400, headers: { "X-Request-ID": requestId } });
    }

    if (!jobDescription || typeof jobDescription !== "string") {
      const errorResp: ApiErrorResponse = {
        success: false,
        error: {
          code: "INVALID_JOB_DESCRIPTION",
          message: "Please provide a valid job description for analysis.",
        },
        requestId,
      };
      return NextResponse.json(errorResp, { status: 400, headers: { "X-Request-ID": requestId } });
    }

    // Convert File -> Buffer
    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Perform Analysis Pipeline
    const result = await analyzeResumeAndJD({
      file: resumeFile,
      buffer,
      jobDescription,
      requestId,
    });

    const successResp: ApiSuccessResponse = {
      success: true,
      data: result,
      requestId,
    };

    return NextResponse.json(successResp, {
      status: 200,
      headers: {
        "X-Request-ID": requestId,
      },
    });
  } catch (error: any) {
    const errorMsg = error.message || "An unexpected error occurred during analysis.";
    logger.error({
      requestId,
      event: "analysis_route_error",
      error: errorMsg,
    });

    let code: ApiErrorCode = "ANALYSIS_FAILED";
    let statusCode = 500;

    if (errorMsg.startsWith("INVALID_FILE") || errorMsg.startsWith("CORRUPTED_FILE")) {
      code = "INVALID_FILE";
      statusCode = 400;
    } else if (errorMsg.startsWith("FILE_TOO_LARGE")) {
      code = "FILE_TOO_LARGE";
      statusCode = 413;
    } else if (errorMsg.startsWith("UNSUPPORTED_FILE_TYPE")) {
      code = "UNSUPPORTED_FILE_TYPE";
      statusCode = 415;
    } else if (errorMsg.startsWith("EMPTY_RESUME")) {
      code = "EMPTY_RESUME";
      statusCode = 400;
    } else if (errorMsg.startsWith("INVALID_JOB_DESCRIPTION")) {
      code = "INVALID_JOB_DESCRIPTION";
      statusCode = 400;
    }

    const errorResp: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message: errorMsg.replace(/^[A-Z_]+:\s*/, ""),
      },
      requestId,
    };

    return NextResponse.json(errorResp, {
      status: statusCode,
      headers: {
        "X-Request-ID": requestId,
      },
    });
  }
}

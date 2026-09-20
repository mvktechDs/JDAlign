import { NextResponse } from "next/server";
import { HealthResponse } from "@/types/api";
import { APP_NAME, APP_VERSION } from "@/lib/config/app";

export const runtime = "nodejs";

export async function GET() {
  const response: HealthResponse = {
    status: "ok",
    service: APP_NAME.toLowerCase().replace(/\s+/g, "-"),
    timestamp: new Date().toISOString(),
    version: APP_VERSION,
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

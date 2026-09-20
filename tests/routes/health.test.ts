import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health Endpoint", () => {
  it("returns status 200 with service info", async () => {
    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.status).toBe("ok");
    expect(data.service).toBe("jdalign");
    expect(data.timestamp).toBeDefined();
  });
});

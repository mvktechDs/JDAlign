import { randomUUID } from "crypto";

export function generateRequestId(): string {
  return `req_${randomUUID().replace(/-/g, "").substring(0, 16)}`;
}

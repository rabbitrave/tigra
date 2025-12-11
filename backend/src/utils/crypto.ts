import crypto from "crypto";

export function sha256Hex(buffer: Buffer | string): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

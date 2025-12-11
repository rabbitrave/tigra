import axios from "axios";
import { config } from "../config";

const IPWORLD_BASE_URL = "https://api.ipworld.example.com"; // replace with real base URL

export interface IpFingerprintCheckInput {
  contentHashHex: string; // 0x-prefixed hash
}

/**
 * Check or register a fingerprint for a given content hash with IPWorld.
 * This is a placeholder; you must adapt endpoint/path to the actual IPWorld API.
 */
export async function checkOrRegisterFingerprint(
  input: IpFingerprintCheckInput
): Promise<any> {
  if (!config.ipworld.apiKey) {
    return { note: "IPWORLD_API_KEY not set; skipping IP fingerprint check." };
  }

  try {
    const res = await axios.post(
      `${IPWORLD_BASE_URL}/fingerprints/check-or-register`,
      {
        hash: input.contentHashHex
      },
      {
        headers: {
          Authorization: `Bearer ${config.ipworld.apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("[IPWorld] checkOrRegisterFingerprint error:", err.response?.data || err.message);
    throw new Error("IPWorld fingerprint check failed");
  }
}

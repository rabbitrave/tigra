import axios from "axios";
import { config } from "../config";

const DYNAMIC_BASE_URL = "https://api.dynamic.xyz"; // adjust if different

export interface DynamicSessionVerifyInput {
  token: string; // JWT or session token from Dynamic frontend
}

/**
 * Verify a Dynamic auth/session token and fetch the associated wallet address.
 */
export async function getWalletFromDynamicSession(
  input: DynamicSessionVerifyInput
): Promise<{ address?: string; raw?: any; note?: string }> {
  if (!config.dynamic.apiKey) {
    return { note: "DYNAMIC_API_KEY not set; cannot verify Dynamic session." };
  }

  try {
    // NOTE: Update this endpoint and body according to Dynamic's latest docs.
    const res = await axios.post(
      `${DYNAMIC_BASE_URL}/sessions/verify`,
      { token: input.token },
      {
        headers: {
          Authorization: `Bearer ${config.dynamic.apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = res.data;
    // You will need to adapt this path once you know how the response looks.
    const address = data?.walletAddress || data?.user?.walletAddress;

    return { address, raw: data };
  } catch (err: any) {
    console.error("[Dynamic] getWalletFromDynamicSession error:", err.response?.data || err.message);
    throw new Error("Dynamic session verification failed");
  }
}

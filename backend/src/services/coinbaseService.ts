import axios from "axios";
import { config } from "../config";

const COINBASE_BASE_URL = "https://api.coinbase.com";

export interface SimplePaymentIntent {
  currency: string; // e.g. "USDC"
  amount: string;   // as string, e.g. "10"
  description?: string;
}

/**
 * Example helper that could represent a "create payment intent" on Coinbase.
 * You will need to adapt the endpoint to match the specific Coinbase Developer API product you use.
 */
export async function createCoinbasePaymentIntent(
  intent: SimplePaymentIntent
): Promise<any> {
  if (!config.coinbase.apiKey) {
    return { note: "COINBASE_API_KEY not set; Coinbase integration skipped." };
  }

  try {
    // NOTE: Replace `/v2/some-endpoint` with the real Coinbase endpoint you decide to use.
    const res = await axios.post(
      `${COINBASE_BASE_URL}/v2/some-endpoint`,
      {
        amount: intent.amount,
        currency: intent.currency,
        description: intent.description
      },
      {
        headers: {
          Authorization: `Bearer ${config.coinbase.apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("[Coinbase] createCoinbasePaymentIntent error:", err.response?.data || err.message);
    throw new Error("Coinbase payment intent failed");
  }
}

import axios from "axios";
import { config } from "../config";

const DUNE_BASE = "https://api.dune.com/api/v1";

export interface DuneQueryOptions {
  queryId: number;
  params?: Record<string, any>;
}

/**
 * Execute a Dune query (pre-configured in your Dune account) to fetch analytics,
 * e.g. total royalties distributed, number of registered assets, etc.
 */
export async function runDuneQuery(options: DuneQueryOptions): Promise<any> {
  if (!config.dune.apiKey) {
    return { note: "DUNE_API_KEY not set; returning empty analytics." };
  }

  try {
    const res = await axios.post(
      `${DUNE_BASE}/query/${options.queryId}/results`,
      {
        params: options.params || {}
      },
      {
        headers: {
          "X-Dune-API-Key": config.dune.apiKey,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("[Dune] runDuneQuery error:", err.response?.data || err.message);
    throw new Error("Dune query failed");
  }
}

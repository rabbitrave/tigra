import axios from "axios";
import { config } from "../config";

const TENDERLY_BASE = "https://api.tenderly.co/api/v1";

export interface SimulationRequest {
  networkId: string;     // e.g. "1" for mainnet, "5" for Goerli, or Storyblok chain id if supported
  from: string;
  to: string;
  input: string;         // encoded calldata
  value?: string;        // in wei, as string
}

/**
 * Run a simulation of a transaction in Tenderly.
 * This is useful to show "what would happen" before sending a real tx.
 */
export async function simulateTransaction(req: SimulationRequest): Promise<any> {
  if (!config.tenderly.apiKey || !config.tenderly.user || !config.tenderly.project) {
    return { note: "Tenderly not fully configured; skipping simulation." };
  }

  try {
    const url = `${TENDERLY_BASE}/account/${config.tenderly.user}/project/${config.tenderly.project}/simulate`;
    const res = await axios.post(
      url,
      {
        network_id: req.networkId,
        from: req.from,
        to: req.to,
        input: req.input,
        value: req.value ?? "0",
        save_if_fails: true
      },
      {
        headers: {
          "X-Access-Key": config.tenderly.apiKey,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data;
  } catch (err: any) {
    console.error("[Tenderly] simulateTransaction error:", err.response?.data || err.message);
    throw new Error("Tenderly simulation failed");
  }
}

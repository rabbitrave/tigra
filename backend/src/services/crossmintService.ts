import axios from "axios";
import { config } from "../config";

const CROSSMINT_BASE_URL = "https://www.crossmint.com/api";

export interface CrossmintMintRequest {
  chain: string;       // "polygon", "ethereum", etc.
  recipient: string;   // wallet address or email (depending on config)
  metadata: {
    name: string;
    image?: string;
    description?: string;
    [key: string]: any;
  };
}

/**
 * Mint an NFT representing an asset.
 * You must configure your Crossmint collection and adjust the endpoint/params accordingly.
 */
export async function mintNftForAsset(req: CrossmintMintRequest): Promise<any> {
  if (!config.crossmint.apiKey) {
    return { note: "CROSSMINT_API_KEY not set; skipping Crossmint mint." };
  }

  try {
    // NOTE: This endpoint is indicative. Adjust to the exact Crossmint API you configure.
    const res = await axios.post(
      `${CROSSMINT_BASE_URL}/2022-06-09/collections/default/nfts`,
      {
        chain: req.chain,
        recipient: req.recipient,
        metadata: req.metadata
      },
      {
        headers: {
          "X-API-KEY": config.crossmint.apiKey,
          "Content-Type": "application/json"
        }
      }
    );
    return res.data;
  } catch (err: any) {
    console.error("[Crossmint] mintNftForAsset error:", err.response?.data || err.message);
    throw new Error("Crossmint mint failed");
  }
}

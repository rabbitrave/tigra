import axios from "axios";
import { config } from "../config";

export interface IndexedAsset {
  id: string;
  owner: string;
  contentHash?: string;
  uri?: string;
  metadataURI?: string;
  blockNumber?: number;
}

/**
 * Fetch assets indexed by Goldsky for a given owner address.
 * You will need to adapt the GraphQL query fields to match your Goldsky schema.
 */
export async function getAssetsByOwner(ownerAddress: string): Promise<IndexedAsset[]> {
  if (!config.goldsky.url) {
    return [];
  }

  const query = `
    query GetAssetsByOwner($owner: String!) {
      assets(where: { owner: $owner }) {
        id
        owner
        contentHash
        uri
        metadataURI
        blockNumber
      }
    }
  `;

  try {
    const res = await axios.post(
      config.goldsky.url,
      {
        query,
        variables: { owner: ownerAddress.toLowerCase() }
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const assets = res.data?.data?.assets ?? [];
    return assets;
  } catch (err: any) {
    console.error("[Goldsky] getAssetsByOwner error:", err.response?.data || err.message);
    // Return empty array instead of throwing, so frontend can still render.
    return [];
  }
}

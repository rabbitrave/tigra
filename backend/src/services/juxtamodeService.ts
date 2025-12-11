import axios from "axios";
import { config } from "../config";

const JUXTAMODE_BASE_URL = "https://api.juxtamode.example.com"; // placeholder

export interface MetadataEnrichmentInput {
  rawContent: string; // text content, or a summary of multimodal content
}

export interface EnrichedMetadata {
  tags: string[];
  categories?: string[];
  language?: string;
  [key: string]: any;
}

/**
 * Call Juxtamode (or similar AI service) to enrich metadata about an asset.
 * This could be used during asset registration to auto-tag content.
 */
export async function enrichMetadata(
  input: MetadataEnrichmentInput
): Promise<EnrichedMetadata> {
  if (!config.juxtamode.apiKey) {
    return {
      tags: [],
      note: "JUXTAMODE_API_KEY not set; returning empty enrichment."
    } as any;
  }

  try {
    const res = await axios.post(
      `${JUXTAMODE_BASE_URL}/metadata/enrich`,
      {
        text: input.rawContent
      },
      {
        headers: {
          Authorization: `Bearer ${config.juxtamode.apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = res.data;
    return {
      tags: data.tags || [],
      categories: data.categories || [],
      language: data.language,
      ...data
    };
  } catch (err: any) {
    console.error("[Juxtamode] enrichMetadata error:", err.response?.data || err.message);
    // Fallback gracefully
    return {
      tags: [],
      categories: [],
      note: "Juxtamode enrichment failed; returning fallback."
    } as any;
  }
}

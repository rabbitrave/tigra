import axios from "axios";
import { config } from "../config";

const LIVEPEER_BASE = "https://livepeer.studio/api";

export async function createLivepeerAsset(name: string, url: string) {
  // placeholder usage – replace with real Livepeer calls
  const res = await axios.post(
    `${LIVEPEER_BASE}/asset/import`,
    { name, url },
    {
      headers: {
        Authorization: `Bearer ${config.livepeer.apiKey}`
      }
    }
  );
  return res.data;
}

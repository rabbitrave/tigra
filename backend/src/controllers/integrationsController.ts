import { Request, Response } from "express";
import { getAssetsByOwner } from "../services/goldskyService";
import { runDuneQuery } from "../services/duneService";
import { mintNftForAsset } from "../services/crossmintService";
import { checkOrRegisterFingerprint } from "../services/ipworldService";
import { enrichMetadata } from "../services/juxtamodeService";
import { createCoinbasePaymentIntent } from "../services/coinbaseService";
import { getWalletFromDynamicSession } from "../services/dynamicService";
import { simulateTransaction } from "../services/tenderlyService";

/**
 * GET /integrations/assets?ownerAddress=0x...
 * Uses Goldsky to fetch indexed assets for a given owner.
 */
export async function getIndexedAssets(req: Request, res: Response) {
  try {
    const ownerAddress = req.query.ownerAddress as string;
    if (!ownerAddress) {
      return res.status(400).json({ error: "ownerAddress query param is required" });
    }

    const assets = await getAssetsByOwner(ownerAddress);
    return res.json({ ownerAddress, assets });
  } catch (err: any) {
    console.error("[Integrations] getIndexedAssets error:", err);
    return res.status(500).json({ error: "Failed to fetch indexed assets" });
  }
}

/**
 * GET /integrations/royalties
 * Uses Dune to fetch royalties analytics.
 * You MUST replace the queryId with a real one from your Dune dashboard.
 */
export async function getRoyaltiesAnalytics(_req: Request, res: Response) {
  try {
    const queryId = 123456; // TODO: replace with your real Dune query ID
    const data = await runDuneQuery({ queryId });
    return res.json({ queryId, data });
  } catch (err: any) {
    console.error("[Integrations] getRoyaltiesAnalytics error:", err);
    return res.status(500).json({ error: "Failed to fetch royalties analytics" });
  }
}

/**
 * POST /integrations/mint
 * Body: { chain, recipient, metadata: { name, image?, description? } }
 * Uses Crossmint to mint an NFT for an asset.
 */
export async function mintAssetNft(req: Request, res: Response) {
  try {
    const { chain, recipient, metadata } = req.body || {};
    if (!chain || !recipient || !metadata?.name) {
      return res.status(400).json({
        error: "chain, recipient, and metadata.name are required in body"
      });
    }

    const result = await mintNftForAsset({ chain, recipient, metadata });
    return res.json({ status: "ok", result });
  } catch (err: any) {
    console.error("[Integrations] mintAssetNft error:", err);
    return res.status(500).json({ error: "Failed to mint NFT via Crossmint" });
  }
}

/**
 * POST /integrations/ip-check
 * Body: { contentHashHex }
 * Uses IPWorld to check/register fingerprint for a content hash.
 */
export async function ipFingerprintCheck(req: Request, res: Response) {
  try {
    const { contentHashHex } = req.body || {};
    if (!contentHashHex) {
      return res.status(400).json({ error: "contentHashHex is required in body" });
    }

    const result = await checkOrRegisterFingerprint({ contentHashHex });
    return res.json({ status: "ok", result });
  } catch (err: any) {
    console.error("[Integrations] ipFingerprintCheck error:", err);
    return res.status(500).json({ error: "Failed to perform IPWorld fingerprint check" });
  }
}

/**
 * POST /integrations/enrich
 * Body: { rawContent }
 * Uses Juxtamode to enrich metadata (tags, categories, etc.).
 */
export async function enrichAssetMetadata(req: Request, res: Response) {
  try {
    const { rawContent } = req.body || {};
    if (!rawContent) {
      return res.status(400).json({ error: "rawContent is required in body" });
    }

    const enriched = await enrichMetadata({ rawContent });
    return res.json({ status: "ok", enriched });
  } catch (err: any) {
    console.error("[Integrations] enrichAssetMetadata error:", err);
    return res.status(500).json({ error: "Failed to enrich metadata" });
  }
}

/**
 * POST /integrations/coinbase-intent
 * Body: { currency, amount, description? }
 * Uses Coinbase to create a simple payment intent (template).
 */
export async function createPaymentIntent(req: Request, res: Response) {
  try {
    const { currency, amount, description } = req.body || {};
    if (!currency || !amount) {
      return res.status(400).json({ error: "currency and amount are required in body" });
    }

    const result = await createCoinbasePaymentIntent({ currency, amount, description });
    return res.json({ status: "ok", result });
  } catch (err: any) {
    console.error("[Integrations] createPaymentIntent error:", err);
    return res.status(500).json({ error: "Failed to create Coinbase payment intent" });
  }
}

/**
 * POST /integrations/dynamic-wallet
 * Body: { token }
 * Verifies a Dynamic session token and returns the wallet address.
 */
export async function getWalletFromDynamic(req: Request, res: Response) {
  try {
    const { token } = req.body || {};
    if (!token) {
      return res.status(400).json({ error: "token is required in body" });
    }

    const result = await getWalletFromDynamicSession({ token });
    return res.json({ status: "ok", result });
  } catch (err: any) {
    console.error("[Integrations] getWalletFromDynamic error:", err);
    return res.status(500).json({ error: "Failed to resolve Dynamic wallet" });
  }
}

/**
 * POST /integrations/simulate
 * Body: { networkId, from, to, input, value? }
 * Uses Tenderly to simulate a transaction.
 */
export async function simulateTx(req: Request, res: Response) {
  try {
    const { networkId, from, to, input, value } = req.body || {};
    if (!networkId || !from || !to || !input) {
      return res.status(400).json({
        error: "networkId, from, to, and input are required in body"
      });
    }

    const result = await simulateTransaction({ networkId, from, to, input, value });
    return res.json({ status: "ok", result });
  } catch (err: any) {
    console.error("[Integrations] simulateTx error:", err);
    return res.status(500).json({ error: "Failed to simulate transaction via Tenderly" });
  }
}

import { assetRegistry } from "./blockchainClient";

export interface RegisterAssetInput {
  contentHashHex: string; // 0x-prefixed hash
  uri: string;
  metadataURI: string;
}

export async function registerAssetOnChain(input: RegisterAssetInput) {
  const tx = await assetRegistry.registerAsset(
    input.contentHashHex,
    input.uri,
    input.metadataURI
  );
  const receipt = await tx.wait();
  const event = receipt.logs.find((log: any) => {
    // naive, refine with Interface.decodeEventLog
    return true;
  });
  // For simplicity, just return tx hash; you can parse assetId from events
  return {
    txHash: tx.hash
  };
}

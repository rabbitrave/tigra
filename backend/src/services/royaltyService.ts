import { tigraToken, royaltyEngine } from "./blockchainClient";

export async function distributeRoyalties(
  assetId: number,
  amount: bigint
) {
  // Approve the RoyaltyEngine to spend TIGRA
  const approveTx = await tigraToken.approve(royaltyEngine.target, amount);
  await approveTx.wait();

  const tx = await royaltyEngine.distribute(assetId, amount);
  const receipt = await tx.wait();
  return { txHash: tx.hash, gasUsed: receipt.gasUsed.toString() };
}

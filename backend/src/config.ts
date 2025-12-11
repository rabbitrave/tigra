import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  rpcUrl: process.env.RPC_URL!,
  chainId: Number(process.env.CHAIN_ID || "0"),
  deployerKey: process.env.DEPLOYER_PRIVATE_KEY!,
  contracts: {
    assetRegistry: process.env.ASSET_REGISTRY_ADDRESS!,
    royaltyEngine: process.env.ROYALTY_ENGINE_ADDRESS!,
    tigraToken: process.env.TIGRA_TOKEN_ADDRESS!
  },
  livepeer: {
    apiKey: process.env.LIVEPEER_API_KEY || ""
  },
  goldsky: {
    url: process.env.GOLDSKY_API_URL || ""
  },
  coinbase: {
    apiKey: process.env.COINBASE_API_KEY || ""
  },
  crossmint: {
    apiKey: process.env.CROSSMINT_API_KEY || ""
  },
  tenderly: {
    user: process.env.TENDERLY_USER || "",
    project: process.env.TENDERLY_PROJECT || "",
    apiKey: process.env.TENDERLY_API_KEY || ""
  },
  dune: {
    apiKey: process.env.DUNE_API_KEY || ""
  },
  ipworld: {
    apiKey: process.env.IPWORLD_API_KEY || ""
  },
  dynamic: {
    apiKey: process.env.DYNAMIC_API_KEY || ""
  },
  juxtamode: {
    apiKey: process.env.JUXTAMODE_API_KEY || ""
  }
};

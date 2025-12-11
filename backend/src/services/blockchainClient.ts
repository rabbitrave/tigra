import { ethers } from "ethers";
import { config } from "../config";
import AssetRegistryAbi from "../../abi/AssetRegistry.json";
import RoyaltyEngineAbi from "../../abi/RoyaltyEngine.json";
import TigraTokenAbi from "../../abi/TigraToken.json";

export const provider = new ethers.JsonRpcProvider(config.rpcUrl);

export const wallet = new ethers.Wallet(config.deployerKey, provider);

export const assetRegistry = new ethers.Contract(
  config.contracts.assetRegistry,
  AssetRegistryAbi,
  wallet
);

export const royaltyEngine = new ethers.Contract(
  config.contracts.royaltyEngine,
  RoyaltyEngineAbi,
  wallet
);

export const tigraToken = new ethers.Contract(
  config.contracts.tigraToken,
  TigraTokenAbi,
  wallet
);

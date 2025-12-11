import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Environment variables
 */
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const STORYBLOK_RPC_URL = process.env.STORYBLOK_RPC_URL || "";
const STORYBLOK_CHAIN_ID = process.env.STORYBLOK_CHAIN_ID
  ? Number(process.env.STORYBLOK_CHAIN_ID)
  : undefined;

/**
 * Validate required network configuration
 */
if (!STORYBLOK_RPC_URL) {
  console.warn("Warning: STORYBLOK_RPC_URL is not set in the environment.");
}

if (!PRIVATE_KEY) {
  console.warn("Warning: PRIVATE_KEY is not set in the environment.");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  networks: {
    storyblok: STORYBLOK_RPC_URL
      ? {
          url: STORYBLOK_RPC_URL,
          accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
          chainId: STORYBLOK_CHAIN_ID
        }
      : undefined
  },

  // Example optional configs (safe to keep for future extensibility)
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD"
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || ""
  }
};

export default config;

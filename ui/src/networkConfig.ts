import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

/**
 * Package ID from your deployment:
 * 0x8f9bbf88b2011477ac5f403b49b45c04fba0d4fe51314c1c059af0a736a38804
 */
const PACKAGE_ID =
  "0x8f9bbf88b2011477ac5f403b49b45c04fba0d4fe51314c1c059af0a736a38804";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        packageId: PACKAGE_ID,
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageId: PACKAGE_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        packageId: PACKAGE_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
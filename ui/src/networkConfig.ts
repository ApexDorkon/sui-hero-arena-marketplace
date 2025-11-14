import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

/**
 * Package ID from your deployment:
 * 0x15b4a8098e2a8dc7e23214ff4447f3fbee4480ae0ceb08ccf9cfc969fbacb6ef
 */
const PACKAGE_ID =
  "0x15b4a8098e2a8dc7e23214ff4447f3fbee4480ae0ceb08ccf9cfc969fbacb6ef";

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
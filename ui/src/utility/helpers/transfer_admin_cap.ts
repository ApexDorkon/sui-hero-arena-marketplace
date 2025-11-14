import { Transaction } from "@mysten/sui/transactions";

export const transferAdminCap = (adminCapId: string, to: string) => {
  const tx = new Transaction();

  // Transfer AdminCap to new owner
  tx.transferObjects(
    [tx.object(adminCapId)], // objects array
    to                      // recipient address
  );

  return tx;
};
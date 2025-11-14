import { Transaction } from "@mysten/sui/transactions";

export const transferHero = (heroId: string, to: string) => {
  const tx = new Transaction();

  // Transfer the hero object to another wallet address
  tx.transferObjects(
    [tx.object(heroId)], // hero object
    to                  // recipient address
  );

  return tx;
};
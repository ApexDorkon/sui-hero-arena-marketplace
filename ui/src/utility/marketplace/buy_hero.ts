import { Transaction } from "@mysten/sui/transactions";

export const buyHero = (
  packageId: string,
  listHeroId: string,
  priceInSui: string
) => {
  const tx = new Transaction();

  // 1. Convert SUI → MIST
  const priceInMist = BigInt(priceInSui) * 1_000_000_000n;

  // 2. Split gas coin for exact payment
  const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(priceInMist)]);

  // 3. Call Move function to buy the hero
  tx.moveCall({
    target: `${packageId}::marketplace::buy_hero`,
    arguments: [
      tx.object(listHeroId),
      paymentCoin,
    ],
  });

  return tx;
};
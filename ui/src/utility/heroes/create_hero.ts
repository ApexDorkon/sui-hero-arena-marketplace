import { Transaction } from "@mysten/sui/transactions";

export const createHero = (
  packageId: string,
  name: string,
  imageUrl: string,
  power: string,
) => {
  const tx = new Transaction();

  // Convert power string → u64 (BigInt)
  const powerU64 = BigInt(power);

  tx.moveCall({
    target: `${packageId}::hero::create_hero`,
    arguments: [
      tx.pure.string(name),
      tx.pure.string(imageUrl),
      tx.pure.u64(powerU64),
    ],
  });

  return tx;
};
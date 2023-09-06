export const calculateTransactionFee = (amount: number, index: number) =>
  index ? 0 : Number(((Number(amount) * 2.9) / 100 + 0.3).toFixed(2));

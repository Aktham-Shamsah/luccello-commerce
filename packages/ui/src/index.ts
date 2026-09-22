export const formatSar = (amount: number) =>
  `${new Intl.NumberFormat("ar", { maximumFractionDigits: 2 }).format(amount)} شيكل`;

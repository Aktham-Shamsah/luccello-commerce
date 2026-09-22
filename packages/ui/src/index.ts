export const formatSar = (amount: number) =>
  new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(amount);

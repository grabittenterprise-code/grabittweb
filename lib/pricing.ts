export const PRODUCT_PRICING = {
  originalPrice: 299,
  salePrice: 200,
  costPrice: 57,
  codCharge: 40,
  offerLabel: "66% OFF",
  currency: "INR" as const,
};

export function formatInr(value: number): string {
  return `\u20B9${value.toLocaleString("en-IN")}`;
}

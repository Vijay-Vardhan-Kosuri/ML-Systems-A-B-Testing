export function formatPercent(n: number, digits = 2): string {
  return `${(n * 100).toFixed(digits)}%`;
}
export function formatNumber(n: number, digits = 2): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(n);
}
export function formatUplift(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${(n * 100).toFixed(2)}%`;
}
export function formatPValue(p: number): string {
  if (p < 0.001) return "< 0.001";
  return p.toFixed(3);
}

export function convertToCurrencyFormat(input?: string): string {
  if (!input) return "";
  const number = parseInt(input, 10);
  return number.toLocaleString("ru-RU");
}

/**
 * Hex-alpha tints for alliance/party colors.
 *
 * Each helper appends a 2-digit alpha value to a 6-digit hex string.
 * e.g. tint.bg("#1F77B4") → "#1F77B41A" (10% opacity blue)
 *
 * Use these instead of literal `color + "1A"` / `"12"` / `"26"` / `"55"` so
 * the intent is named at the call site and palette tweaks happen in one place.
 */
export const tint = {
  /** ~10% alpha — backdrop fills, soft chip backgrounds */
  bg: (hex: string) => hex + "1A",
  /** ~7% alpha — softer fills (e.g. losing-candidate bars) */
  bgSoft: (hex: string) => hex + "12",
  /** ~15% alpha — emphasized fills (e.g. winning-candidate bars) */
  bgStrong: (hex: string) => hex + "26",
  /** ~33% alpha — borders */
  border: (hex: string) => hex + "55",
}

export type ColorSwatch = { name: string; nameEn: string; hex: string };

export const COLOR_PALETTE: ColorSwatch[] = [
  { name: "Krem", nameEn: "cream", hex: "#D9CDBB" },
  { name: "Beyaz", nameEn: "white", hex: "#F5F3EF" },
  { name: "Antrasit", nameEn: "anthracite grey", hex: "#3A3A3D" },
  { name: "Adaçayı Yeşili", nameEn: "sage green", hex: "#8A9A82" },
  { name: "Lacivert", nameEn: "navy blue", hex: "#2B3A55" },
  { name: "Ceviz Kahvesi", nameEn: "walnut brown", hex: "#6B4A34" },
];

export function englishColorName(turkishName: string | null): string | null {
  if (!turkishName) return null;
  const match = COLOR_PALETTE.find((c) => c.name === turkishName);
  return match ? match.nameEn : null;
}

export function isValidHex(hex: string): boolean {
  return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(hex);
}

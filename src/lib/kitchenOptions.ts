import { englishColorName } from "@/lib/colorPalette";

export type CabinetStyle = "membran" | "lake" | "ahsap" | "duz-modern";
export type HandleStyle = "altin" | "siyah" | "gumus" | "kulpsuz";
export type CountertopMaterial = "mermer" | "granit" | "beton" | "ahsap";
export type EquipmentPosition = "sol" | "orta" | "sag";

export type KitchenConfig = {
  cabinetStyle: CabinetStyle;
  cabinetColorHex: string;
  cabinetColorName: string | null;
  handleStyle: HandleStyle;
  countertop: CountertopMaterial;
  glassDisplay: boolean;
  underCabinetLighting: boolean;
  hobPosition: EquipmentPosition;
  sinkPosition: EquipmentPosition;
  ovenPosition: EquipmentPosition;
  dishwasherPosition: EquipmentPosition;
  extraRequest: string;
};

export const DEFAULT_KITCHEN_CONFIG: KitchenConfig = {
  cabinetStyle: "membran",
  cabinetColorHex: "#D9CDBB",
  cabinetColorName: "Krem",
  handleStyle: "altin",
  countertop: "mermer",
  glassDisplay: true,
  underCabinetLighting: true,
  hobPosition: "orta",
  sinkPosition: "orta",
  ovenPosition: "sag",
  dishwasherPosition: "sol",
  extraRequest: "",
};

export const CABINET_STYLES: { id: CabinetStyle; label: string; hint: string }[] = [
  { id: "membran", label: "Membran Kapak", hint: "Folyo kaplı MDF, mat yüzey" },
  { id: "lake", label: "Lake Kapak", hint: "Yüksek parlak, boyalı yüzey" },
  { id: "ahsap", label: "Ahşap Kapak", hint: "Doğal ahşap doku" },
  { id: "duz-modern", label: "Düz Modern", hint: "Kulpsuz, minimal çizgi" },
];

export const HANDLE_STYLES: { id: HandleStyle; label: string }[] = [
  { id: "altin", label: "Altın / Pirinç" },
  { id: "siyah", label: "Siyah" },
  { id: "gumus", label: "Gümüş / Krom" },
  { id: "kulpsuz", label: "Kulpsuz" },
];

export const COUNTERTOPS: { id: CountertopMaterial; label: string }[] = [
  { id: "mermer", label: "Mermer Görünümlü" },
  { id: "granit", label: "Granit" },
  { id: "beton", label: "Beton Görünümü" },
  { id: "ahsap", label: "Ahşap" },
];

export const EQUIPMENT_POSITIONS: { id: EquipmentPosition; label: string }[] = [
  { id: "sol", label: "Sol" },
  { id: "orta", label: "Orta" },
  { id: "sag", label: "Sağ" },
];

const CABINET_STYLE_EN: Record<CabinetStyle, string> = {
  membran: "foil-wrapped MDF (membrane) cabinet doors with a matte finish",
  lake: "high-gloss lacquered cabinet doors",
  ahsap: "natural wood-grain cabinet doors",
  "duz-modern": "flat-front handleless modern cabinet doors",
};

const HANDLE_STYLE_EN: Record<HandleStyle, string> = {
  altin: "brushed gold/brass bar handles",
  siyah: "matte black bar handles",
  gumus: "brushed chrome/silver bar handles",
  kulpsuz: "no visible handles, push-to-open fronts",
};

const COUNTERTOP_EN: Record<CountertopMaterial, string> = {
  mermer: "white marble-look",
  granit: "granite",
  beton: "polished concrete-look",
  ahsap: "butcher-block wood",
};

const POSITION_EN: Record<EquipmentPosition, string> = {
  sol: "left",
  orta: "center",
  sag: "right",
};

const KITCHEN_NEGATIVE_PROMPT =
  "angled view, perspective distortion, wide-angle lens, fisheye, warped lines, blurry, distorted walls, warped windows, floating furniture, extra doors, unrealistic proportions, low quality, watermark";

export function buildKitchenPrompt(config: KitchenConfig): string {
  const colorEn = englishColorName(config.cabinetColorName);
  const colorDesc = colorEn ? `${colorEn} tone (${config.cabinetColorHex})` : config.cabinetColorHex;

  const parts = [
    "photorealistic frontal elevation photo of a fitted kitchen cabinet wall",
    `${CABINET_STYLE_EN[config.cabinetStyle]} in a ${colorDesc}`,
    HANDLE_STYLE_EN[config.handleStyle],
    config.glassDisplay
      ? "upper cabinets include a glass-front display section showing dishes, lit from inside"
      : "closed upper cabinets",
    config.underCabinetLighting ? "warm LED under-cabinet lighting along the counter" : "",
    `${COUNTERTOP_EN[config.countertop]} countertop and matching backsplash`,
    `black gas hob positioned at the ${POSITION_EN[config.hobPosition]} of the counter`,
    `black undermount sink with a black faucet positioned at the ${POSITION_EN[config.sinkPosition]}`,
    `built-in black oven positioned at the ${POSITION_EN[config.ovenPosition]}`,
    `stainless steel dishwasher positioned at the ${POSITION_EN[config.dishwasherPosition]}`,
    "symmetrical straight-on architectural photography, natural lighting, high detail",
    config.extraRequest.trim(),
  ];

  return parts.filter(Boolean).join(", ");
}

export function buildKitchenNegativePrompt(): string {
  return KITCHEN_NEGATIVE_PROMPT;
}

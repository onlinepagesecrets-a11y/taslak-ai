import { englishColorName } from "@/lib/colorPalette";

export type RoomType = "kitchen" | "bathroom" | "closet" | "bedroom";

export const ROOM_TYPES: { id: RoomType; label: string }[] = [
  { id: "kitchen", label: "Mutfak" },
  { id: "bathroom", label: "Banyo" },
  { id: "closet", label: "Vestiyer" },
  { id: "bedroom", label: "Yatak Odası" },
];

const BASE_BY_ROOM: Record<RoomType, string> = {
  kitchen:
    "a fully fitted kitchen with cabinets, countertop, sink and appliances built into the existing wall layout",
  bathroom:
    "a fully fitted bathroom with sink, mirror and fixtures built into the existing wall layout",
  closet:
    "a fully fitted walk-in closet with floor-to-ceiling wardrobe cabinets, open shelving, hanging rails and a shoe rack built into the existing wall layout",
  bedroom:
    "a furnished bedroom with a bed, wardrobe and nightstand arranged along the existing walls",
};

const NEGATIVE_PROMPT =
  "blurry, distorted walls, warped windows, floating furniture, extra doors, unrealistic proportions, low quality, watermark";

/**
 * Combines the room-type base description with an optional color choice and the
 * user's free-text request into a single prompt for the ControlNet/inpainting model.
 * The model preserves geometry on its own (depth + segmentation conditioning) —
 * this just describes intent.
 */
export function buildPrompt(
  roomType: RoomType,
  userRequest: string,
  colorHex?: string,
  colorName?: string | null,
): string {
  const base = BASE_BY_ROOM[roomType];
  const colorEn = englishColorName(colorName ?? null);
  const colorDesc = colorEn
    ? `in a ${colorEn} tone (${colorHex})`
    : colorHex
      ? `in ${colorHex}`
      : "";
  const extra = userRequest.trim();

  const parts = [base, colorDesc, extra].filter(Boolean);
  return `photorealistic interior design photo, ${parts.join(", ")}, natural lighting, high detail, architectural photography`;
}

export function buildNegativePrompt(): string {
  return NEGATIVE_PROMPT;
}

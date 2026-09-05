import Replicate from "replicate";

export type GenerateInput = {
  imageDataUrl: string;
  productImageDataUrl?: string;
  prompt: string;
  negativePrompt: string;
  /** Kullanıcının konum tercihi, ürün yerleştirme modunda placement prompt'a eklenir */
  placementHint?: string;
  apiToken?: string;
};

export type GenerateResult = {
  demo: boolean;
  imageUrl?: string;
};

// Oda tasarımı (tek görsel + prompt)
const INTERIOR_MODEL =
  "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";

// Ürün yerleştirme (iki görsel: oda + ürün) — güçlü çoklu-görsel birleştirme ve kimlik koruma
const PLACEMENT_MODEL = "google/nano-banana-2";

function extractUrl(output: unknown): string | undefined {
  const result = Array.isArray(output) ? output[0] : output;
  if (typeof result === "string") return result;
  if (typeof (result as { url?: () => URL })?.url === "function") {
    return (result as { url: () => URL }).url().toString();
  }
  return undefined;
}

export async function generateDraft(input: GenerateInput): Promise<GenerateResult> {
  const token = input.apiToken || process.env.REPLICATE_API_TOKEN;
  if (!token) return { demo: true };

  const replicate = new Replicate({ auth: token });

  let output: unknown;

  if (input.productImageDataUrl) {
    // Ürün + oda: nano-banana-2 ile birleştirme (sahne kimliğini korur)
    const position = input.placementHint?.trim()
      ? `Place it ${input.placementHint.trim()}, without covering any doors or windows.`
      : `Place it against a clear, empty section of the wall, without covering any doors or windows.`;

    const placementPrompt =
      `The first image is a room photo. The second image is a furniture/product reference (usually a flat, ` +
      `front-facing studio product photo). ` +
      `Keep the first image exactly as it is — same walls, wall color, wallpaper pattern, door, door design, floor, ` +
      `windows, ceiling, lighting and camera angle must remain unchanged. Do not regenerate or restyle the room. ` +
      `Take the furniture item shown in the second image and re-render it from the exact same camera angle and ` +
      `perspective as the room in the first image — if the room is shot at a slight angle, the furniture must be ` +
      `rotated/angled to match that same perspective, not placed flat-on like the original product photo. ` +
      `Keep the furniture's design, color, material and relative proportions faithful to the reference, but scale ` +
      `it realistically: its height, width and depth must be proportional to real-world furniture size and to the ` +
      `room's existing elements (door height, ceiling height, floor tiles/rug) visible in the first image — it must ` +
      `not look stretched, oversized, distorted, small, shrunken, plain or understated. Render it at a confident, ` +
      `generous, true-to-reference scale so it has the same strong visual presence and level of detail it has in ` +
      `the second image — a full-size piece of furniture occupying the wall space naturally, not a miniature or ` +
      `simplified version. ` +
      `The base of the furniture must sit flush and flat on the floor with a correct contact shadow. ` +
      `${position} ` +
      `Match the room's lighting direction and color temperature so shadows and highlights on the furniture are ` +
      `consistent with the rest of the photo. ` +
      `The final result must look like a single real, unedited photograph — photorealistic, correct perspective, ` +
      `correct proportions, no visible seams, no distortion, no floating objects.`;

    output = await replicate.run(PLACEMENT_MODEL as `${string}/${string}`, {
      input: {
        prompt: placementPrompt,
        image_input: [input.imageDataUrl, input.productImageDataUrl],
        aspect_ratio: "match_input_image",
        resolution: "2K",
        output_format: "png",
      },
    });
  } else {
    // Sadece oda: interior-design modeli
    const model = process.env.REPLICATE_MODEL || INTERIOR_MODEL;
    output = await replicate.run(model as `${string}/${string}:${string}`, {
      input: {
        image: input.imageDataUrl,
        prompt: input.prompt,
        negative_prompt: input.negativePrompt,
        guidance_scale: 15,
        prompt_strength: 0.8,
        num_inference_steps: 30,
      },
    });
  }

  const url = extractUrl(output);
  if (!url) throw new Error("Replicate yanıtından görsel URL'i okunamadı.");

  return { demo: false, imageUrl: url };
}

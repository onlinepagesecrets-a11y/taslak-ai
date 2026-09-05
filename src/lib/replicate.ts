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

// Ürün yerleştirme (iki görsel: oda + ürün)
const PLACEMENT_MODEL = "prunaai/p-image-edit";

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
    // Ürün + oda: p-image-edit ile yerleştirme
    const position = input.placementHint?.trim()
      ? `Position it ${input.placementHint.trim()}, without covering any doors or windows.`
      : `Position it against a clear, empty section of the wall, without covering any doors or windows.`;

    const placementPrompt =
      `Edit image 1 (the room) by adding the furniture item from image 2 into it. ` +
      `Preserve the exact design, shape, color, material and proportions of the product shown in image 2 — ` +
      `do not redesign, restyle or reinterpret it, copy it as-is. ` +
      `Do not change the walls, wall color, floor, door, windows or any other existing element of the room in image 1. ` +
      `${position} ` +
      `Match the room's perspective, scale and lighting so the product blends in naturally. ` +
      `Photorealistic, high detail, seamless and realistic integration.`;

    output = await replicate.run(PLACEMENT_MODEL as `${string}/${string}`, {
      input: {
        prompt: placementPrompt,
        images: [input.imageDataUrl, input.productImageDataUrl],
        aspect_ratio: "match_input_image",
        turbo: false,
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

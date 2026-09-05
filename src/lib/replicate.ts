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
      `The first image is a room. The second image is a furniture/product item. ` +
      `Keep the first image exactly as it is — same walls, wall color, wallpaper pattern, door, door design, floor, ` +
      `windows, lighting and camera angle must remain unchanged. Do not regenerate or restyle the room. ` +
      `Add the exact furniture item from the second image into this room, keeping its design, color, material, ` +
      `and proportions identical to the reference — do not redesign it. ` +
      `${position} ` +
      `Blend it naturally into the room with correct scale, perspective and matching shadows/lighting. ` +
      `The result must look like a single real photograph, photorealistic, seamless, no visible editing artifacts.`;

    output = await replicate.run(PLACEMENT_MODEL as `${string}/${string}`, {
      input: {
        prompt: placementPrompt,
        image_input: [input.imageDataUrl, input.productImageDataUrl],
        aspect_ratio: "match_input_image",
        resolution: "1K",
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

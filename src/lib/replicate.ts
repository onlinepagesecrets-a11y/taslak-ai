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

// Ürün yerleştirme (iki görsel: oda + ürün) — ChatGPT'nin görsel üretiminde kullandığı model
const PLACEMENT_MODEL = "openai/gpt-image-2";

function extractUrl(output: unknown): string | undefined {
  const result = Array.isArray(output) ? output[0] : output;
  if (typeof result === "string") return result;
  if (typeof (result as { url?: () => URL })?.url === "function") {
    return (result as { url: () => URL }).url().toString();
  }
  return undefined;
}

/**
 * Ürün yerleştirme talimatı — KATEGORİDEN BAĞIMSIZDIR.
 * Mutfak, banyo, vestiyer, yatak odası fark etmez: ürün fotoğrafı yüklendiğinde
 * bu talimat aynen uygulanır. Kategoriye özel istisna eklenmez.
 *
 * Not: gpt-image-2 (ChatGPT'nin görsel üretiminde kullandığı model) ile kısa ve
 * net talimatlar, aşırı detaylı/uzun kısıtlama listelerinden daha iyi sonuç verir
 * (kullanıcı testiyle doğrulandı — bkz. proje notları). Bu yüzden prompt kasıtlı
 * olarak sade tutulur; modelin kendi görsel-anlama yeteneğine güvenilir.
 */
function buildPlacementPrompt(placementHint?: string): string {
  const position = placementHint?.trim()
    ? ` Place it ${placementHint.trim()}.`
    : "";

  return (
    `Analyze both images. Design image 1 by placing the exact item from image 2 into the empty space in image 1, ` +
    `positioned naturally and realistically, matching image 1's perspective, scale and lighting, without changing ` +
    `anything else in image 1.${position}`
  );
}

export async function generateDraft(input: GenerateInput): Promise<GenerateResult> {
  const token = input.apiToken || process.env.REPLICATE_API_TOKEN;
  if (!token) return { demo: true };

  const replicate = new Replicate({ auth: token });

  let output: unknown;

  if (input.productImageDataUrl) {
    // Ürün + oda: gpt-image-2 ile birleştirme (ChatGPT'nin kullandığı model)
    // Kurallar kategoriden bağımsızdır — bkz. buildPlacementPrompt üstündeki not.
    output = await replicate.run(PLACEMENT_MODEL as `${string}/${string}`, {
      input: {
        prompt: buildPlacementPrompt(input.placementHint),
        input_images: [input.imageDataUrl, input.productImageDataUrl],
        aspect_ratio: "auto",
        quality: "high",
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

import Replicate from "replicate";

export type GenerateInput = {
  imageDataUrl: string;
  /** Yerleştirilecek ürün/mobilya fotoğrafı (opsiyonel). Model destekliyorsa ikinci görsel olarak iletilir. */
  productImageDataUrl?: string;
  prompt: string;
  negativePrompt: string;
  /** Kullanıcının kendi Replicate API anahtarı (BYOK). Verilmezse process.env.REPLICATE_API_TOKEN'a düşer (yalnızca yerel demo için). */
  apiToken?: string;
};

export type GenerateResult = {
  demo: boolean;
  imageUrl?: string;
};

/**
 * REPLICATE_MODEL must be a full "owner/name:version" string, copied from the
 * model's API tab on replicate.com — Replicate version hashes are not stable
 * across model updates, so this is left to configuration rather than hardcoded.
 * Verified live candidate: https://replicate.com/adirik/interior-design
 */
export async function generateDraft(input: GenerateInput): Promise<GenerateResult> {
  const token = input.apiToken || process.env.REPLICATE_API_TOKEN;
  const model = process.env.REPLICATE_MODEL;

  if (!token || !model) {
    return { demo: true };
  }

  const replicate = new Replicate({ auth: token });

  const modelInput: Record<string, unknown> = {
    image: input.imageDataUrl,
    prompt: input.prompt,
    negative_prompt: input.negativePrompt,
    guidance_scale: 15,
    prompt_strength: 0.8,
    num_inference_steps: 30,
  };

  // Ürün görseli varsa modele ilet (model destekliyorsa kullanır)
  if (input.productImageDataUrl) {
    modelInput.product_image = input.productImageDataUrl;
  }

  const output = await replicate.run(model as `${string}/${string}:${string}`, {
    input: modelInput,
  });

  const result = Array.isArray(output) ? output[0] : output;
  const url =
    typeof result === "string"
      ? result
      : typeof (result as { url?: () => URL })?.url === "function"
        ? (result as { url: () => URL }).url().toString()
        : undefined;

  if (!url) {
    throw new Error("Replicate yanıtından görsel URL'i okunamadı.");
  }

  return { demo: false, imageUrl: url };
}

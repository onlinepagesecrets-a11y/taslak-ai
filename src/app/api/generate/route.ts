import { NextResponse } from "next/server";
import { buildNegativePrompt, buildPrompt, type RoomType } from "@/lib/promptTemplates";
import { buildKitchenNegativePrompt, buildKitchenPrompt, type KitchenConfig } from "@/lib/kitchenOptions";
import { generateDraft } from "@/lib/replicate";

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get("image");
  const productImage = formData.get("productImage");
  const roomType = formData.get("roomType") as RoomType | null;
  const userRequest = (formData.get("userRequest") as string | null) ?? "";
  const kitchenConfigRaw = formData.get("kitchenConfig") as string | null;
  const colorHex = (formData.get("colorHex") as string | null) ?? undefined;
  const colorName = formData.get("colorName") as string | null;

  if (!(image instanceof File)) {
    return NextResponse.json({ error: "Fotoğraf bulunamadı." }, { status: 400 });
  }
  if (!roomType) {
    return NextResponse.json({ error: "Oda tipi seçilmedi." }, { status: 400 });
  }

  let prompt: string;
  let negativePrompt: string;

  if (roomType === "kitchen" && kitchenConfigRaw) {
    let kitchenConfig: KitchenConfig;
    try {
      kitchenConfig = JSON.parse(kitchenConfigRaw);
    } catch {
      return NextResponse.json({ error: "Mutfak ayarları okunamadı." }, { status: 400 });
    }
    prompt = buildKitchenPrompt(kitchenConfig);
    negativePrompt = buildKitchenNegativePrompt();
  } else {
    prompt = buildPrompt(roomType, userRequest, colorHex, colorName);
    negativePrompt = buildNegativePrompt();
  }

  const bytes = Buffer.from(await image.arrayBuffer());
  const imageDataUrl = `data:${image.type};base64,${bytes.toString("base64")}`;

  let productImageDataUrl: string | undefined;
  if (productImage instanceof File) {
    const productBytes = Buffer.from(await productImage.arrayBuffer());
    productImageDataUrl = `data:${productImage.type};base64,${productBytes.toString("base64")}`;
  }

  try {
    const result = await generateDraft({ imageDataUrl, productImageDataUrl, prompt, negativePrompt });
    return NextResponse.json({ ...result, prompt });
  } catch (err) {
    console.error("generate route error:", err);

    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 401 || status === 403) {
      return NextResponse.json(
        { error: "Replicate API anahtarı geçersiz. .env.local dosyasında REPLICATE_API_TOKEN'ı kontrol et." },
        { status: 400 },
      );
    }
    if (status === 402) {
      return NextResponse.json(
        { error: "Replicate hesabında yeterli bakiye yok. replicate.com adresinden kredi ekle." },
        { status: 402 },
      );
    }

    return NextResponse.json(
      { error: "Taslak üretilirken bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 502 },
    );
  }
}

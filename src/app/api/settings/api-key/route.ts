import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encryptSecret } from "@/lib/crypto";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmalısın." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const apiKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";

  if (apiKey.length < 10) {
    return NextResponse.json({ error: "Geçerli bir Replicate API anahtarı gir." }, { status: 400 });
  }

  const encrypted = encryptSecret(apiKey);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { replicateApiKeyEnc: encrypted },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmalısın." }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { replicateApiKeyEnc: null },
  });

  return NextResponse.json({ ok: true });
}

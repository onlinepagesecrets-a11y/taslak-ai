import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth zorunluluğu kaldırıldı — uygulama doğrudan erişilebilir.
export default function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

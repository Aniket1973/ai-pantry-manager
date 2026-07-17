import { NextResponse } from "next/server";

// Force dynamic route - prevents Next.js from collecting page data during build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  // Lazy import to prevent Prisma initialization during build
  const { getCurrentUserFromRequest } = await import("@/lib/session");
  const user = await getCurrentUserFromRequest(request);
  return NextResponse.json({ user: user ?? null });
}

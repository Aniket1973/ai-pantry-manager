import { NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/session";

// Force dynamic route - prevents Next.js from collecting page data during build
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getCurrentUserFromRequest(request);
  return NextResponse.json({ user: user ?? null });
}

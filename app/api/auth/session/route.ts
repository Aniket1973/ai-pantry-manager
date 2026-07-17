import { NextResponse } from "next/server";
import { getCurrentUserFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  const user = await getCurrentUserFromRequest(request);
  return NextResponse.json({ user: user ?? null });
}

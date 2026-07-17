import { authHandler } from "@/lib/auth";

// Force dynamic route - prevents Next.js from collecting page data during build
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return authHandler(request);
}

export async function GET(request: Request) {
  return authHandler(request);
}

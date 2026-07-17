// Force dynamic route - prevents Next.js from collecting page data during build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  // Lazy import to prevent Auth.js/Prisma initialization during build
  const { authHandler } = await import("@/lib/auth");
  return authHandler(request);
}

export async function GET(request: Request) {
  // Lazy import to prevent Auth.js/Prisma initialization during build
  const { authHandler } = await import("@/lib/auth");
  return authHandler(request);
}

import { authHandler } from "@/lib/auth";

export async function POST(request: Request) {
  return authHandler(request);
}

export async function GET(request: Request) {
  return authHandler(request);
}

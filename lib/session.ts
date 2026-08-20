import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function getCurrentUserFromRequest(request: Request) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not defined");
  }

  const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;
  const cookieName = secureCookie
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";
  const token = await getToken({
    req: request,
    secret,
    salt: cookieName,
    cookieName,
    secureCookie,
  });
  if (!token?.sub || typeof token.sub !== "string") {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: token.sub },
    select: { id: true, name: true, email: true, image: true },
  });

  return user;
}

export async function getCurrentUserFromHeaders(headers: Headers) {
  const request = new Request("http://localhost", { headers });
  return getCurrentUserFromRequest(request);
}

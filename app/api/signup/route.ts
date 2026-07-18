import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const { default: prisma } = await import("@/lib/prisma");
  const { signUpSchema } = await import("@/lib/validators");

  const data = await request.json();
  const parsed = signUpSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (existingUser) {
    return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      hashedPassword: await bcrypt.hash(parsed.data.password, 10),
    },
  });

  return NextResponse.json({ success: true });
}

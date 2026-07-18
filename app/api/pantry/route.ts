import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { default: prisma } = await import("@/lib/prisma");
  const { getCurrentUserFromRequest } = await import("@/lib/session");

  const user = await getCurrentUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.pantryItem.findMany({
    where: { userId: user.id },
    orderBy: [{ expiryDate: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const { default: prisma } = await import("@/lib/prisma");
  const { getCurrentUserFromRequest } = await import("@/lib/session");
  const { pantryItemSchema } = await import("@/lib/validators");

  const user = await getCurrentUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = pantryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const item = await prisma.pantryItem.create({
    data: {
      name: parsed.data.name,
      quantity: parsed.data.quantity,
      unit: parsed.data.unit,
      category: parsed.data.category,
      expiryDate: new Date(parsed.data.expiryDate),
      userId: user.id,
    },
  });

  return NextResponse.json({ item });
}

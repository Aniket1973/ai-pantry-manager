import { NextResponse } from "next/server";

// Force dynamic route - prevents Next.js from collecting page data during build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: any }) {
  // Lazy imports to prevent Prisma/Auth initialization during build
  const prisma = (await import("@/lib/prisma")).default;
  const { getCurrentUserFromRequest } = await import("@/lib/session");
  const { pantryItemSchema } = await import("@/lib/validators");

  const user = await getCurrentUserFromRequest(request);
  const params = context.params as { id: string };
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const item = await prisma.pantryItem.findUnique({ where: { id: params.id } });
  if (!item || item.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = pantryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const updated = await prisma.pantryItem.update({
    where: { id: params.id },
    data: {
      name: parsed.data.name,
      quantity: parsed.data.quantity,
      unit: parsed.data.unit,
      category: parsed.data.category,
      expiryDate: new Date(parsed.data.expiryDate),
    },
  });

  return NextResponse.json({ item: updated });
}

export async function DELETE(request: Request, context: { params: any }) {
  // Lazy imports to prevent Prisma/Auth initialization during build
  const prisma = (await import("@/lib/prisma")).default;
  const { getCurrentUserFromRequest } = await import("@/lib/session");

  const user = await getCurrentUserFromRequest(request);
  const params = context.params as { id: string };
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const item = await prisma.pantryItem.findUnique({ where: { id: params.id } });
  if (!item || item.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.pantryItem.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserFromRequest } from "@/lib/session";
import { pantryItemSchema } from "@/lib/validators";

export async function PATCH(request: Request, context: { params: any }) {
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

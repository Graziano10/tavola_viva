import { NextRequest, NextResponse } from 'next/server';

import { withErrorHandling, guardRateLimit, assertAdmin } from '@/lib/api';
import { getAdminSession } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { sanitizeOptionalText, sanitizeText } from '@/lib/sanitize';
import { orderSchema, orderStatusSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    guardRateLimit(request, 'orders:get');
    const session = await getAdminSession();
    assertAdmin(Boolean(session));

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            menuItem: true,
            menuItemVariant: true,
          },
        },
      },
    });
    return NextResponse.json({ data: orders });
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    guardRateLimit(request, 'orders:post');
    const parsed = orderSchema.parse(await request.json());

    const menuItemIds = parsed.items.map((item) => item.menuItemId);
    const variantIds = parsed.items.flatMap((item) => (item.variantId ? [item.variantId] : []));

    const [menuItems, variants] = await Promise.all([
      prisma.menuItem.findMany({ where: { id: { in: menuItemIds }, isAvailable: true } }),
      prisma.menuItemVariant.findMany({ where: { id: { in: variantIds }, isAvailable: true } }),
    ]);

    const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));
    const variantMap = new Map(variants.map((variant) => [variant.id, variant]));

    let totalCents = 0;

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          customerName: sanitizeText(parsed.customerName),
          customerEmail: sanitizeText(parsed.customerEmail),
          customerPhone: sanitizeText(parsed.customerPhone),
          notes: sanitizeOptionalText(parsed.notes),
          totalCents: 0,
        },
      });

      for (const line of parsed.items) {
        const menuItem = menuItemMap.get(line.menuItemId);
        if (!menuItem) throw new AppError(400, 'Selected menu item is no longer available');

        const variant = line.variantId ? variantMap.get(line.variantId) : null;
        const unitPriceCents = menuItem.priceCents + (variant?.priceDeltaCents ?? 0);
        totalCents += unitPriceCents * line.quantity;

        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            menuItemId: menuItem.id,
            variantId: variant?.id,
            quantity: line.quantity,
            unitPriceCents,
          },
        });
      }

      return tx.order.update({
        where: { id: createdOrder.id },
        data: { totalCents },
        include: { items: true },
      });
    });

    return NextResponse.json({ data: order }, { status: 201 });
  });
}

export async function PATCH(request: NextRequest) {
  return withErrorHandling(async () => {
    guardRateLimit(request, 'orders:patch');
    const session = await getAdminSession();
    assertAdmin(Boolean(session));

    const url = new URL(request.url);
    const orderId = url.searchParams.get('id');
    if (!orderId) throw new AppError(400, 'Order id is required');

    const parsed = orderStatusSchema.parse(await request.json());
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: parsed.status },
    });

    return NextResponse.json({ data: order });
  });
}

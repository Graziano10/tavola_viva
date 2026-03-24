import { NextRequest, NextResponse } from 'next/server';

import { withErrorHandling, guardRateLimit, assertAdmin } from '@/lib/api';
import { getAdminSession } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { sanitizeOptionalText, sanitizeSlug, sanitizeText } from '@/lib/sanitize';
import { menuItemSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    guardRateLimit(request, 'menu-items:get');
    const items = await prisma.menuItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, variants: true },
    });
    return NextResponse.json({ data: items });
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    guardRateLimit(request, 'menu-items:post');
    const session = await getAdminSession();
    assertAdmin(Boolean(session));

    const parsed = menuItemSchema.parse(await request.json());
    const category = await prisma.category.findUnique({ where: { id: parsed.categoryId } });
    if (!category) throw new AppError(404, 'Category not found');

    const item = await prisma.menuItem.create({
      data: {
        categoryId: parsed.categoryId,
        name: sanitizeText(parsed.name),
        slug: sanitizeSlug(parsed.slug ?? parsed.name),
        description: sanitizeOptionalText(parsed.description),
        priceCents: parsed.priceCents,
        imageUrl: parsed.imageUrl ?? null,
        isAvailable: parsed.isAvailable,
        preparationTimeMin: parsed.preparationTimeMin,
        variants: {
          create: parsed.variants.map((variant) => ({
            name: sanitizeText(variant.name),
            priceDeltaCents: variant.priceDeltaCents,
            isAvailable: variant.isAvailable,
          })),
        },
      },
      include: { variants: true },
    });

    return NextResponse.json({ data: item }, { status: 201 });
  });
}

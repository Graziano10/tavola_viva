import { NextRequest, NextResponse } from 'next/server';

import { withErrorHandling, guardRateLimit, assertAdmin } from '@/lib/api';
import { getAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sanitizeOptionalText, sanitizeSlug, sanitizeText } from '@/lib/sanitize';
import { categorySchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    guardRateLimit(request, 'menu-categories:get');
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { items: true },
    });
    return NextResponse.json({ data: categories });
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    guardRateLimit(request, 'menu-categories:post');
    const session = await getAdminSession();
    assertAdmin(Boolean(session));

    const parsed = categorySchema.parse(await request.json());
    const slug = sanitizeSlug(parsed.slug ?? parsed.name);
    const category = await prisma.category.create({
      data: {
        name: sanitizeText(parsed.name),
        slug,
        description: sanitizeOptionalText(parsed.description),
        sortOrder: parsed.sortOrder,
        isActive: parsed.isActive,
      },
    });

    return NextResponse.json({ data: category }, { status: 201 });
  });
}

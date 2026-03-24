import { cache } from 'react';

import { prisma } from '@/lib/prisma';

export const getMenu = cache(async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: [{ createdAt: 'desc' }],
        include: {
          variants: {
            where: { isAvailable: true },
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  });
});

export const getMenuCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      items: {
        orderBy: { name: 'asc' },
        include: { variants: true },
      },
    },
  });
});

export async function getDashboardData() {
  const [orders, reservations, categories] = await Promise.all([
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
    prisma.reservation.findMany({
      take: 10,
      orderBy: { reservationAt: 'asc' },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { items: { include: { variants: true } } },
    }),
  ]);

  return { orders, reservations, categories };
}

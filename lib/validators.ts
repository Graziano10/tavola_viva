import { OrderStatus } from '@prisma/client';
import { z } from 'zod';

const slugSchema = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9-]+$/);

export const categorySchema = z.object({
  name: z.string().min(2).max(80),
  slug: slugSchema.optional(),
  description: z.string().max(300).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});

export const menuItemSchema = z.object({
  categoryId: z.string().cuid(),
  name: z.string().min(2).max(120),
  slug: slugSchema.optional(),
  description: z.string().max(500).optional().nullable(),
  priceCents: z.coerce.number().int().min(100),
  imageUrl: z.string().url().optional().nullable(),
  isAvailable: z.coerce.boolean().default(true),
  preparationTimeMin: z.coerce.number().int().min(1).max(180).default(15),
  variants: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        priceDeltaCents: z.coerce.number().int().min(-5000).max(50_000).default(0),
        isAvailable: z.coerce.boolean().default(true),
      }),
    )
    .max(10)
    .default([]),
});

export const orderSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7).max(20),
  notes: z.string().max(500).optional().nullable(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().cuid(),
        variantId: z.string().cuid().optional().nullable(),
        quantity: z.coerce.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(30),
});

export const orderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export const reservationSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7).max(20),
  partySize: z.coerce.number().int().min(1).max(20),
  reservationAt: z.string().datetime(),
  notes: z.string().max(500).optional().nullable(),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(128),
});

import { NextRequest, NextResponse } from 'next/server';

import { withErrorHandling, guardRateLimit, assertAdmin } from '@/lib/api';
import { getAdminSession } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { prisma } from '@/lib/prisma';
import { sanitizeOptionalText, sanitizeText } from '@/lib/sanitize';
import { reservationSchema } from '@/lib/validators';

function normalizeSlot(date: Date, slotMinutes: number) {
  const millis = slotMinutes * 60 * 1000;
  return new Date(Math.floor(date.getTime() / millis) * millis);
}

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    guardRateLimit(request, 'reservations:get');
    const session = await getAdminSession();
    assertAdmin(Boolean(session));

    const reservations = await prisma.reservation.findMany({
      orderBy: { reservationAt: 'asc' },
    });
    return NextResponse.json({ data: reservations });
  });
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    guardRateLimit(request, 'reservations:post');
    const parsed = reservationSchema.parse(await request.json());
    const reservationDate = new Date(parsed.reservationAt);
    if (Number.isNaN(reservationDate.getTime())) throw new AppError(400, 'Invalid reservation date');

    const settings = await prisma.restaurantSetting.findFirst();
    if (!settings) throw new AppError(500, 'Restaurant settings missing');

    const slot = normalizeSlot(reservationDate, settings.reservationSlotMinutes);
    const slotEnd = new Date(slot.getTime() + settings.reservationSlotMinutes * 60 * 1000);

    const reservation = await prisma.$transaction(async (tx) => {
      const seatsReserved = await tx.reservation.aggregate({
        _sum: { partySize: true },
        where: {
          reservationAt: {
            gte: slot,
            lt: slotEnd,
          },
        },
      });

      const reservedSeats = seatsReserved._sum.partySize ?? 0;
      if (reservedSeats + parsed.partySize > settings.maxSeatsPerSlot) {
        throw new AppError(409, 'Fascia oraria non disponibile: capienza massima raggiunta');
      }

      return tx.reservation.create({
        data: {
          customerName: sanitizeText(parsed.customerName),
          customerEmail: sanitizeText(parsed.customerEmail),
          customerPhone: sanitizeText(parsed.customerPhone),
          partySize: parsed.partySize,
          reservationAt: reservationDate,
          notes: sanitizeOptionalText(parsed.notes),
        },
      });
    });

    return NextResponse.json({ data: reservation, success: true }, { status: 201 });
  });
}

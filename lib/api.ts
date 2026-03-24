import { NextRequest, NextResponse } from 'next/server';

import { AppError, toErrorResponse } from '@/lib/errors';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function withErrorHandling(handler: () => Promise<NextResponse>) {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof Error && error.message === 'RATE_LIMITED') {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    return toErrorResponse(error);
  }
}

export function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() ?? 'anonymous';
}

export function assertAdmin(isAdmin: boolean) {
  if (!isAdmin) {
    throw new AppError(401, 'Unauthorized');
  }
}

export function guardRateLimit(request: NextRequest, prefix: string) {
  enforceRateLimit(`${prefix}:${getClientKey(request)}`);
}

import { NextRequest, NextResponse } from 'next/server';

import { withErrorHandling, guardRateLimit } from '@/lib/api';
import { setAdminSession, verifyAdminCredentials } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { adminLoginSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    guardRateLimit(request, 'admin-login:post');
    const parsed = adminLoginSchema.parse(await request.json());

    const isValid = await verifyAdminCredentials(parsed.email, parsed.password);
    if (!isValid) throw new AppError(401, 'Invalid credentials');

    await setAdminSession(parsed.email);
    return NextResponse.json({ success: true });
  });
}

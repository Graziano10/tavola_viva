type Entry = {
  count: number;
  expiresAt: number;
};

const store = new Map<string, Entry>();

export function enforceRateLimit(
  key: string,
  maxRequests = Number(process.env.RATE_LIMIT_MAX ?? 60),
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.expiresAt < now) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return;
  }

  if (entry.count >= maxRequests) {
    throw new Error('RATE_LIMITED');
  }

  entry.count += 1;
  store.set(key, entry);
}

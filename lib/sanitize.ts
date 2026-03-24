const TAG_PATTERN = /<[^>]*>/g;
const CONTROL_PATTERN = /[\u0000-\u001F\u007F]/g;

export function sanitizeText(value: string) {
  return value.replace(TAG_PATTERN, '').replace(CONTROL_PATTERN, '').trim();
}

export function sanitizeOptionalText(value?: string | null) {
  if (!value) return null;
  const sanitized = sanitizeText(value);
  return sanitized.length > 0 ? sanitized : null;
}

export function sanitizeSlug(value: string) {
  return sanitizeText(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function normalizeExternalUrl(value: unknown): string {
  let raw = String(value ?? '').trim()

  if (!raw) return '#'

  // Remove accidental whitespace.
  raw = raw.replace(/\s+/g, '')

  // Already absolute.
  if (/^https?:\/\//i.test(raw)) {
    return raw
  }

  // Protocol-relative.
  if (raw.startsWith('//')) {
    return `https:${raw}`
  }

  // Email / telephone.
  if (/^(mailto|tel):/i.test(raw)) {
    return raw
  }

  // Known external services.
  if (
    /^(www\.)?linkedin\.com(\/|$)/i.test(raw) ||
    /^(www\.)?github\.com(\/|$)/i.test(raw) ||
    /^(www\.)?instagram\.com(\/|$)/i.test(raw) ||
    /^(www\.)?facebook\.com(\/|$)/i.test(raw) ||
    /^(www\.)?twitter\.com(\/|$)/i.test(raw) ||
    /^(www\.)?x\.com(\/|$)/i.test(raw) ||
    /^(www\.)?youtube\.com(\/|$)/i.test(raw) ||
    /^(www\.)?behance\.net(\/|$)/i.test(raw) ||
    /^(www\.)?dribbble\.com(\/|$)/i.test(raw)
  ) {
    return `https://${raw}`
  }

  // Generic domain.
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) {
    return `https://${raw}`
  }

  // Anything beginning with / is intentionally internal.
  if (raw.startsWith('/')) {
    return raw
  }

  // Treat remaining non-anchor values as external.
  if (!raw.startsWith('#')) {
    return `https://${raw}`
  }

  return raw
}

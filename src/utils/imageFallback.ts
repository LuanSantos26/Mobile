const BRAND_COLOR = 'F8B125';

export function getInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export function getAvatarFallbackUrl(nome: string, size = 200): string {
  const initials = getInitials(nome);
  const params = new URLSearchParams({
    name: initials,
    background: BRAND_COLOR,
    color: 'fff',
    bold: 'true',
    size: String(size),
    format: 'png',
  });
  return `https://ui-avatars.com/api/?${params.toString()}`;
}

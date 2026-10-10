/**
 * Prefix an internal path with the site's base path, so links work both on
 * GitHub Pages (/Four-Leaf-Furniture/…) and on a custom domain (/…).
 */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

/** True when `current` is `path` or inside it (for nav highlighting). */
export function isActive(current: string, path: string): boolean {
  const c = current.replace(import.meta.env.BASE_URL.replace(/\/$/, ''), '') || '/';
  return path === '/' ? c === '/' : c.startsWith(path);
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

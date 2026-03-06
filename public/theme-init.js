const name = 'company_theme';
const raw = document.cookie
  .split('; ')
  .find((row) => row.startsWith(name + '='))
  ?.split('=')[1];
const decoded = raw ? decodeURIComponent(raw.trim()) : '';
let preference = 'system';
if (decoded === 'light' || decoded === 'dark' || decoded === 'system') {
  preference = decoded;
} else if (decoded) {
  try {
    const p = JSON.parse(decoded);
    if (p.theme === 'light' || p.theme === 'dark' || p.theme === 'system') {
      preference = p.theme;
    }
  } catch (_) {}
}
const prefersDark =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = preference === 'dark' || (preference === 'system' && prefersDark);
document.documentElement.classList.toggle('dark', isDark);

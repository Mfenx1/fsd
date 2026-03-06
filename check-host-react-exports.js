import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url));
const ROUTE_PATH = join(rootDir, 'src/app/api/host-react/route.ts');
const ALLOWED_EXTRA = new Set(['jsxsDEV']);

const getPublicNames = (obj) => {
  const set = new Set();
  for (const k of Object.getOwnPropertyNames(obj)) {
    if (k !== 'default' && k !== '__esModule') set.add(k);
  }
  for (const k of Object.keys(obj)) {
    if (k !== 'default') set.add(k);
  }
  return [...set].sort();
};

const filterPublic = (names) =>
  names.filter((n) => !n.startsWith('__') && n !== 'module' && n !== 'version' && n !== 'module.exports');

const parseArrayFromRoute = (content, name) => {
  const re = new RegExp(`const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*(?:as const)?\\s*;`, 'm');
  const m = content.match(re);
  if (!m) return null;
  return m[1]
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
    .sort();
};

const diff = (actual, expected) => {
  const expectedSet = new Set(expected);
  const extra = actual.filter((n) => !expectedSet.has(n) && !ALLOWED_EXTRA.has(n));
  const missing = expected.filter((n) => !actual.includes(n));
  return { extra, missing };
};

const main = async () => {
  const content = readFileSync(ROUTE_PATH, 'utf-8');

  const [react, reactDom, reactDomClient, jsxRuntime, jsxDevRuntime] = await Promise.all([
    import('react').then((m) => m.default),
    import('react-dom'),
    import('react-dom/client'),
    import('react/jsx-runtime'),
    import('react/jsx-dev-runtime'),
  ]);

  const expected = {
    REACT_NAMES: filterPublic(getPublicNames(react)),
    RDOM_NAMES: filterPublic([...new Set([...getPublicNames(reactDom), ...getPublicNames(reactDomClient)])].sort()),
    JSX_NAMES: filterPublic([...new Set([...getPublicNames(jsxRuntime), ...getPublicNames(jsxDevRuntime)])].sort()),
  };

  const results = [];
  for (const [label, expectedList] of Object.entries(expected)) {
    const actual = parseArrayFromRoute(content, label);
    if (!actual) {
      results.push({ label, extra: [], missing: ['(массив не найден в route.ts)'] });
      continue;
    }
    const { extra, missing } = diff(actual, expectedList);
    if (extra.length || missing.length) results.push({ label, extra, missing });
  }

  const fatal = results.filter((r) => r.extra.length > 0);
  const missingOnly = results.filter((r) => r.missing.length > 0 && r.extra.length === 0);

  missingOnly.forEach(({ label, missing }) =>
    console.warn(`host-react: ${label} — в пакете есть, в route нет: ${missing.join(', ')}`)
  );

  if (fatal.length > 0) {
    console.error('host-react export check failed:\n');
    fatal.forEach(({ label, extra }) =>
      console.error(`  ${label}: в route указаны имена, которых нет в пакете: ${extra.join(', ')}`)
    );
    console.error('\nИсправьте src/app/api/host-react/route.ts');
    process.exit(1);
  }

  console.log('OK host-react: все имена из route.ts есть в react/react-dom.');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

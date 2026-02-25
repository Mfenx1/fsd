import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const REACT_NAMES = [
  'Children', 'Component', 'PureComponent', 'StrictMode', 'Suspense', 'cloneElement',
  'createContext', 'createElement', 'forwardRef', 'lazy', 'memo', 'useCallback', 'useContext',
  'useDebugValue', 'useEffect', 'useId', 'useImperativeHandle', 'useInsertionEffect', 'useLayoutEffect',
  'useMemo', 'useReducer', 'useRef', 'useState', 'useSyncExternalStore',
] as const;

const RDOM_NAMES = [
  'createPortal', 'createRoot', 'flushSync', 'hydrateRoot', 'hydrate', 'render', 'unmountComponentAtNode',
] as const;

const RDOM_BIND_NAMES = new Set(['createRoot', 'createPortal', 'flushSync', 'hydrateRoot', 'hydrate', 'render', 'unmountComponentAtNode']);

const JSX_NAMES = ['Fragment', 'jsx', 'jsxDEV', 'jsxs', 'jsxsDEV'] as const;

const buildEsm = (): string => {
  const reactExports = REACT_NAMES.map((n) => `export const ${n} = R?.${n};`).join('\n');
  const rdomExports = RDOM_NAMES.map((n) =>
    RDOM_BIND_NAMES.has(n)
      ? `export const ${n} = RDOM?.${n} ? RDOM.${n}.bind(RDOM) : undefined;`
      : `export const ${n} = RDOM?.${n};`
  ).join('\n');
  const jsxExports = JSX_NAMES.map((n) => `export const ${n} = jrxDev?.${n} ?? jrx?.${n};`).join('\n');
  return `
const w = typeof window !== 'undefined' ? window : undefined;
const R = w?.__HOST_REACT__;
const RDOM = w?.__HOST_REACT_DOM__;
const jrx = w?.__HOST_REACT_JSX__;
const jrxDev = w?.__HOST_REACT_JSX_DEV__;
export const React = R;
export const ReactDOM = RDOM;
${rdomExports}
${reactExports}
${jsxExports}
export default R;
`;
};

const esm = buildEsm();

const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'];

export const GET = (request: NextRequest) => {
  const origin = request.headers.get('origin');
  const corsHeaders: Record<string, string> = {};
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  }
  return new NextResponse(esm, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store',
      ...corsHeaders,
    },
  });
};
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

const ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174', 'null'];

const buildReactModule = (): string => {
  const reactExports = REACT_NAMES.map((n) => `export const ${n} = R?.${n};`).join('\n');
  return `
const w = typeof window !== 'undefined' ? window : undefined;
const R = w?.__HOST_REACT__;
export const React = R;
${reactExports}
export default R;
`;
};

const buildReactDomModule = (): string => {
  const rdomExports = RDOM_NAMES.map((n) =>
    RDOM_BIND_NAMES.has(n)
      ? `export const ${n} = RDOM?.${n} ? RDOM.${n}.bind(RDOM) : undefined;`
      : `export const ${n} = RDOM?.${n};`
  ).join('\n');
  return `
const w = typeof window !== 'undefined' ? window : undefined;
const RDOM = w?.__HOST_REACT_DOM__;
export const ReactDOM = RDOM;
${rdomExports}
export default RDOM;
`;
};

const buildReactDomClientModule = (): string => `
const w = typeof window !== 'undefined' ? window : undefined;
const RDOM = w?.__HOST_REACT_DOM__;
export const createRoot = RDOM?.createRoot?.bind(RDOM);
export const hydrateRoot = RDOM?.hydrateRoot?.bind(RDOM);
export default { createRoot, hydrateRoot };
`;

const buildJsxRuntimeModule = (): string => {
  const jsxExports = JSX_NAMES.map((n) => `export const ${n} = jrxDev?.${n} ?? jrx?.${n};`).join('\n');
  return `
const w = typeof window !== 'undefined' ? window : undefined;
const jrx = w?.__HOST_REACT_JSX__;
const jrxDev = w?.__HOST_REACT_JSX_DEV__;
${jsxExports}
export default { Fragment, jsx, jsxDEV, jsxs, jsxsDEV };
`;
};

const REACT_QUERY_NAMES = [
  'QueryClient', 'QueryClientProvider', 'useQuery', 'useMutation', 'useQueryClient',
  'useInfiniteQuery', 'useIsFetching', 'useIsMutating', 'HydrationBoundary',
  'useQueryErrorResetBoundary', 'useSuspenseQuery', 'useSuspenseInfiniteQuery',
  'useSuspenseQueries', 'IsRestoringProvider', 'useIsRestoring',
  'useMutationState', 'useInfiniteQueryResult', 'useQueryResult',
] as const;

const buildReactQueryModule = (): string => {
  const exports = REACT_QUERY_NAMES.map((n) => `export const ${n} = RQ?.${n};`).join('\n');
  return `
const w = typeof window !== 'undefined' ? window : undefined;
const RQ = w?.__HOST_REACT_QUERY__;
${exports}
export default RQ;
`;
};

const MODULES: Record<string, () => string> = {
  'react': buildReactModule,
  'react-dom': buildReactDomModule,
  'react-dom/client': buildReactDomClientModule,
  'react/jsx-runtime': buildJsxRuntimeModule,
  'react/jsx-dev-runtime': buildJsxRuntimeModule,
  '@tanstack/react-query': buildReactQueryModule,
};

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  const { path } = await params;
  const specifier = path.join('/');
  const build = MODULES[specifier];
  if (!build) {
    return new NextResponse('Not found', { status: 404 });
  }

  const origin = request.headers.get('origin');
  const corsHeaders: Record<string, string> = {};
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  }

  return new NextResponse(build(), {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store',
      ...corsHeaders,
    },
  });
};
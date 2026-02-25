'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { exposeReactGlobals, type RemoteMountContract, type RemoteMountProps } from '../../lib';
import { RemoteMessageView } from '../RemoteMessageView';
import { useRemoteModulesStore } from '../../model';
import { cn } from '$shared';
import type { RemoteName } from '../../config';


const dynamicImport = (url: string): Promise<unknown> => {
  const win = typeof window !== 'undefined' ? (window as unknown as { importShim?: (u: string) => Promise<unknown> }) : null;
  if (win && typeof win.importShim === 'function') {
    return win.importShim(url);
  }
  return import(/* webpackIgnore: true */ url);
};

export const RemoteLoader = ({
  remoteUrl,
  remoteName = 'products',
  integrity,
  mountProps,
  fallback = null,
  mountTargetId,
}: {
  remoteUrl: string;
  remoteName?: RemoteName;
  
  integrity?: string;
  
  mountProps?: RemoteMountProps;
  fallback?: React.ReactNode;
  
  mountTargetId?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'mounted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const remoteRef = useRef<RemoteMountContract | null>(null);
  const setRemoteStatus = useRemoteModulesStore((s) => s.setRemoteStatus);

  useEffect(() => {
    const container = mountTargetId
      ? document.getElementById(mountTargetId)
      : containerRef.current;
    if (!container || !remoteUrl) return;

    exposeReactGlobals();
    const name = remoteName as RemoteName;
    queueMicrotask(() => {
      setStatus('loading');
      setRemoteStatus(name, { status: 'loading' });
    });
    const props = mountProps;

    const isViteDev =
      /:\d{4}\/src\/remote-dev\.tsx/.test(remoteUrl ?? '') ||
      /\/remote-(?:products|chat)\/src\/remote-dev\.tsx/.test(remoteUrl ?? '');

    if (isViteDev) {
      const viteBase = (() => {
        try {
          const u = new URL(remoteUrl);
          const m = remoteUrl.match(/\/remote-(?:products|chat)(?=\/)/);
          return m ? `${u.origin}${m[0]}` : u.origin;
        } catch {
          return '';
        }
      })();

      const loadWithCacheBuster = (url: string, t?: string) => {
        const u = t ? `${url}${url.includes('?') ? '&' : '?'}t=${t}` : url;
        return dynamicImport(u) as Promise<RemoteMountContract>;
      };

      const loadViteDevRemote = async (cacheBuster?: string): Promise<RemoteMountContract> => {
        const win = window as unknown as {
          $RefreshReg$?: () => void;
          $RefreshSig$?: (type: unknown) => unknown;
          __vite_plugin_react_preamble_installed__?: boolean;
        };
        if (viteBase) {
          try {
            const [RefreshMod] = await Promise.all([
              dynamicImport(`${viteBase}/@react-refresh`).catch(() => null),
              dynamicImport(`${viteBase}/@vite/client`),
            ]);
            if (RefreshMod && typeof (RefreshMod as { default?: { injectIntoGlobalHook: (w: typeof window) => void } }).default?.injectIntoGlobalHook === 'function') {
              (RefreshMod as { default: { injectIntoGlobalHook: (w: typeof window) => void } }).default.injectIntoGlobalHook(window);
            }
          } catch {
            
          }
        }
        win.$RefreshReg$ = () => {};
        win.$RefreshSig$ = (type: unknown) => type;
        win.__vite_plugin_react_preamble_installed__ = true;
        return loadWithCacheBuster(remoteUrl, cacheBuster);
      };

      let lastHash = '';
      let pollId: ReturnType<typeof setInterval> | null = null;
      let pollInFlight = false;

      const doMount = (mod: RemoteMountContract) => {
        remoteRef.current = mod;
        mod.mount(container, props);
        setStatus('mounted');
        setRemoteStatus(name, { status: 'mounted', version: mod.version });
      };

      const doUnmount = (defer = false) => {
        const r = remoteRef.current;
        remoteRef.current = null;
        const unmount = r?.unmount;
        if (unmount) {
          if (defer) queueMicrotask(() => unmount(container));
          else unmount(container);
        }
      };

      const pollAndReload = async () => {
        if (pollInFlight) return;
        pollInFlight = true;
        try {
          const res = await fetch(`/api/dev/remote-hash?remote=${name}`);
          if (!res.ok) return;
          const { hash } = (await res.json()) as { hash: string };
          if (lastHash && hash !== lastHash) {
            lastHash = hash;
            doUnmount();
            const mod = await loadViteDevRemote(hash);
            if (mod) doMount(mod);
          } else if (!lastHash) {
            lastHash = hash;
          }
        } catch {
          
        } finally {
          pollInFlight = false;
        }
      };

      loadViteDevRemote()
        .then((mod: RemoteMountContract) => {
          if (!mod.mount) {
            const msg = 'Remote не экспортировал mount';
            setErrorMessage(msg);
            setStatus('error');
            setRemoteStatus(name, { status: 'error', error: msg });
            return;
          }
          doMount(mod);
          pollId = setInterval(pollAndReload, 2500);
        })
        .catch((e) => {
          const raw = (e?.message ?? String(e ?? '')) || '';
          if (process.env.NODE_ENV === 'development' && e?.stack) {
            console.error('[RemoteLoader]', raw, e.stack);
          }
          const hint =
            (typeof raw === 'string' && (raw.includes('fetch') || raw.includes('Failed to load')))
              ? ' Запустите remote (npm run dev:host в remotes/products или remotes/chat)'
              : '';
          const msg = `${raw}${hint}`;
          setErrorMessage(msg);
          setStatus('error');
          setRemoteStatus(name, { status: 'error', error: msg });
        });
      return () => {
        if (pollId) clearInterval(pollId);
        setStatus('idle');
        setRemoteStatus(name, { status: 'idle', version: undefined, error: undefined });
        doUnmount(true);
      };
    }

    const loadEsModule = (url: string): Promise<RemoteMountContract> => {
      
      const useBlob =
        integrity &&
        !/:\d{4}\/src\/remote-dev\.tsx/.test(url ?? '') &&
        !/\/remote-(?:products|chat)\/src\/remote-dev\.tsx/.test(url ?? '');
      if (useBlob) {
        return fetch(url, { integrity, credentials: 'omit' })
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.text();
          })
          .then((code) => {
            const blob = new Blob([code], { type: 'application/javascript' });
            const blobUrl = URL.createObjectURL(blob);
            return dynamicImport(blobUrl).finally(() =>
              URL.revokeObjectURL(blobUrl)
            ) as Promise<RemoteMountContract>;
          });
      }
      return dynamicImport(url) as Promise<RemoteMountContract>;
    };

    loadEsModule(remoteUrl)
      .then((mod) => {
        if (!mod.mount) {
          const msg = `Remote "${remoteName}" не экспортировал mount`;
          setErrorMessage(msg);
          setStatus('error');
          setRemoteStatus(name, { status: 'error', error: msg });
          return;
        }
        remoteRef.current = mod;
        mod.mount(container, props);
        setStatus('mounted');
        setRemoteStatus(name, { status: 'mounted', version: mod.version });
      })
      .catch((e) => {
        if (process.env.NODE_ENV === 'development' && e?.stack) {
          console.error('[RemoteLoader]', e?.message, e.stack);
        }
        const msg = (e?.message ?? `Не удалось загрузить модуль: ${remoteUrl}`) || 'Неизвестная ошибка загрузки';
        setErrorMessage(msg);
        setStatus('error');
        setRemoteStatus(name, { status: 'error', error: msg });
      });

    return () => {
      const remote = remoteRef.current;
      remoteRef.current = null;
      setStatus('idle');
      setRemoteStatus(name, { status: 'idle', version: undefined, error: undefined });
      const unmountFn = remote?.unmount;
      if (unmountFn) {
        queueMicrotask(() => unmountFn(container));
      }
    };
  }, [remoteUrl, remoteName, integrity, mountProps, setRemoteStatus, mountTargetId]);

  if (mountTargetId) {
    return null;
  }

  if (status === 'error') {
    return (
      <RemoteMessageView
        variant="error"
        title="Ошибка загрузки Remote"
        description={errorMessage}
      />
    );
  }

  const showFallback = status === 'idle' || status === 'loading';

  return (
    <div
      className="flex flex-col h-full min-h-0 remote-mount relative"
      data-remote={remoteName}
    >
      <motion.div
        className="absolute inset-0 z-0"
        initial={false}
        animate={{ opacity: showFallback ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: showFallback ? 'auto' : 'none' }}
      >
        {fallback}
      </motion.div>
      <motion.div
        ref={containerRef}
        className={cn(
          'flex-1 min-h-0 min-w-0 w-full flex flex-col remote-mount__container relative z-10',
          `remote-mount__container--${remoteName}`
        )}
        initial={false}
        animate={{ opacity: showFallback ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: showFallback ? 'none' : 'auto' }}
        aria-busy={status === 'loading'}
      />
    </div>
  );
};
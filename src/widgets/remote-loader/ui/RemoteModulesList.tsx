'use client';

import { Loader2, CheckCircle, XCircle, Globe } from 'lucide-react';
import { useRemoteModulesStore } from '../model';
import { useRemoteManifestsContext } from './RemoteManifestsContext';
import { REMOTES_REGISTRY, type RemoteName } from '../config';
import { cn } from '$shared';

const getDisplayStatus = (
  mountStatus: string,
  manifest: unknown,
  loading: boolean
): { icon: typeof CheckCircle; label: string; className: string } => {
  if (mountStatus === 'mounted')
    return { icon: CheckCircle, label: 'Загружен', className: 'text-emerald-600 dark:text-emerald-400' };
  if (mountStatus === 'loading')
    return { icon: Loader2, label: 'Загрузка', className: 'text-amber-600 dark:text-amber-400 animate-spin' };
  if (mountStatus === 'error')
    return { icon: XCircle, label: 'Ошибка', className: 'text-red-600 dark:text-red-400' };
  if (loading) return { icon: Loader2, label: 'Проверка…', className: 'text-slate-400 dark:text-zinc-500 animate-spin' };
  if (manifest)
    return { icon: Globe, label: 'Доступен', className: 'text-slate-500 dark:text-zinc-400' };
  return { icon: XCircle, label: 'Недоступен', className: 'text-slate-300 dark:text-zinc-500' };
};

export const RemoteModulesList = () => {
  const remotesState = useRemoteModulesStore((s) => s.remotes);
  const { manifests, loading } = useRemoteManifestsContext();
  const names = Object.keys(REMOTES_REGISTRY) as RemoteName[];

  if (names.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-zinc-400">Нет подключённых модулей.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-600">
      <table className="w-full min-w-[320px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-zinc-600 bg-slate-50 dark:bg-zinc-800/80">
            <th className="px-3 py-2 text-left font-medium text-slate-600 dark:text-zinc-300" scope="col">
              Статус
            </th>
            <th className="px-3 py-2 text-left font-medium text-slate-600 dark:text-zinc-300" scope="col">
              Модуль
            </th>
            <th className="px-3 py-2 text-left font-medium text-slate-600 dark:text-zinc-300" scope="col">
              Версия
            </th>
            <th className="px-3 py-2 text-left font-medium text-slate-600 dark:text-zinc-300" scope="col">
              Примечание
            </th>
          </tr>
        </thead>
        <tbody>
          {names.map((name) => {
            const config = REMOTES_REGISTRY[name];
            const state = remotesState[name];
            const manifest = manifests[name];
            const mountStatus = state?.status ?? 'idle';
            const { icon: StatusIcon, label: statusLabel, className } = getDisplayStatus(
              mountStatus,
              manifest,
              loading
            );
            const version = state?.version ?? manifest?.version;
            const error = state?.error;
            const label = manifest?.label ?? config?.label ?? name;
            const note = error ?? '—';

            return (
              <tr
                key={name}
                className="border-b border-slate-100 dark:border-zinc-700 last:border-b-0"
                title={error ?? undefined}
              >
                <td className="px-3 py-2">
                  <span className="flex items-center gap-2">
                    <StatusIcon size={18} className={cn('shrink-0', className)} aria-hidden />
                    <span className="text-slate-600 dark:text-zinc-300">{statusLabel}</span>
                  </span>
                </td>
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-zinc-100">{label}</td>
                <td className="px-3 py-2 text-slate-600 dark:text-zinc-300 tabular-nums">
                  {version != null ? `v${version}` : '—'}
                </td>
                <td className="px-3 py-2 text-slate-500 dark:text-zinc-400">{note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
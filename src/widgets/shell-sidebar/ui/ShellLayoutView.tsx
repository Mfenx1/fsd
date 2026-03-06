'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Package, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '$features';
import { useResolvedTheme } from '$widgets';
import { Modal, ROUTES } from '$shared';
import {
  RemoteModulesList,
  RemoteManifestsProvider,
  prefetchRemote,
  prefetchAllRemotes,
  ChatRemoteLoader,
  type RemoteName,
} from '$widgets';
import { ShellSidebar } from './ShellSidebar';
import { FloatingChatButton } from './FloatingChatButton';

const PATH_TO_REMOTE: Record<string, RemoteName> = {
  [ROUTES.PRODUCTS]: 'products',
  [ROUTES.CHAT]: 'chat',
};

type LinkLike = React.ComponentType<{
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onMouseEnter?: () => void;
  onMouseDown?: () => void;
}>;

const LinkWithPrefetch = ({
  href,
  children,
  className,
  title,
  onMouseEnter,
  onMouseDown,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onMouseEnter?: () => void;
  onMouseDown?: () => void;
}) => {
  const remoteName = PATH_TO_REMOTE[href];

  const prefetch = useCallback(() => {
    if (remoteName) prefetchRemote(remoteName);
  }, [remoteName]);

  const handleMouseEnter = useCallback(() => {
    prefetch();
    onMouseEnter?.();
  }, [prefetch, onMouseEnter]);
  
  const handleMouseDown = useCallback(() => {
    prefetch();
    onMouseDown?.();
  }, [prefetch, onMouseDown]);

  return (
    <Link
      href={href}
      className={className}
      title={title}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
    >
      {children}
    </Link>
  );
};

export const ShellLayoutView = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations('shell');
  const pathname = usePathname();
  const { logout } = useAuth();
  const isDark = useResolvedTheme() === 'dark';
  const [aboutOpen, setAboutOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const sidebarLinks: Array<{ href: string; label: string; icon: typeof Package; remoteName?: RemoteName }> = [
    { href: ROUTES.PRODUCTS, label: t('nav.products'), icon: Package, remoteName: 'products' },
    { href: ROUTES.CHAT, label: t('nav.chat'), icon: MessageCircle, remoteName: 'chat' },
  ];

  useEffect(() => {
    prefetchAllRemotes();
  }, []);

  const openAbout = useCallback(() => setAboutOpen(true), []);
  const closeAbout = useCallback(() => setAboutOpen(false), []);
  const openChat = useCallback(() => {
    prefetchRemote('chat');
    setChatOpen(true);
  }, []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  return (
    <RemoteManifestsProvider>
    <div
      className="flex h-screen bg-zinc-50/80 dark:bg-zinc-900/80 shell-layout"
      data-theme={isDark ? 'dark' : 'light'}
    >
      <ShellSidebar
        title={t('title')}
        links={sidebarLinks}
        activeHref={pathname ?? '/'}
        onLogout={logout}
        LinkComponent={LinkWithPrefetch as LinkLike}
        logoutLabel={t('logout')}
        logoutIcon={<LogOut className="h-5 w-5 shrink-0 text-zinc-600 dark:text-zinc-300" aria-hidden />}
        aboutLabel={t('about')}
        onAboutClick={openAbout}
      />
      <Modal
        open={aboutOpen}
        onClose={closeAbout}
        title={t('aboutModal.title')}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 px-3 py-2 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-300">{t('aboutModal.host')}</span>
            <span className="tabular-nums text-slate-600 dark:text-slate-400">
              v{process.env.NEXT_PUBLIC_APP_VERSION ?? '—'}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('aboutModal.remotes')}
          </p>
          <RemoteModulesList />
        </div>
      </Modal>
      <Modal
        open={chatOpen}
        onClose={closeChat}
        title={t('chatModal.title')}
        size="md"
        position="bottom-right"
        className="!max-w-[500px] h-[600px] flex flex-col"
        contentClassName="p-0 flex-1 min-h-0 flex flex-col overflow-hidden"
      >
        <ChatRemoteLoader />
      </Modal>
      <FloatingChatButton onClick={openChat} ariaLabel={t('openChat')} />
      <main id="main" className="flex-1 min-w-0 flex flex-col overflow-hidden" tabIndex={-1}>
        {children}
      </main>
    </div>
    </RemoteManifestsProvider>
  );
};
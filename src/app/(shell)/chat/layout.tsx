import type { Metadata } from 'next';
import { createPageMetadata } from '../../_config';

const CHAT_TITLE = 'Общение';
const CHAT_DESCRIPTION = 'Чат. Company.';

export const metadata: Metadata = {
  ...createPageMetadata({
    title: CHAT_TITLE,
    description: CHAT_DESCRIPTION,
    path: '/chat',
    robots: { index: false, follow: false },
  }),
};

const ChatLayout = ({ children }: { children: React.ReactNode }) => children;

export default ChatLayout;
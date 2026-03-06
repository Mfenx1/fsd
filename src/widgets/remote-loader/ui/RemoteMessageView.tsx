import type { ReactNode } from 'react';

interface RemoteMessageViewProps {
  title: string;
  description?: ReactNode;
  variant?: 'error' | 'neutral';
}

export const RemoteMessageView = ({
  title,
  description,
  variant = 'neutral',
}: RemoteMessageViewProps) => (
  <div
    className={`flex flex-col h-full items-center justify-center p-8 ${
      variant === 'error' ? 'text-red-600' : 'text-gray-600'
    }`}
  >
    <p className="font-medium">{title}</p>
    {description && <p className="text-sm mt-1">{description}</p>}
  </div>
);
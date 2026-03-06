'use client';

import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { cn } from '$shared';

export interface FloatingChatButtonProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}


export const FloatingChatButton = ({
  onClick,
  className,
  ariaLabel = 'Открыть чат',
}: FloatingChatButtonProps) => (
  <motion.button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    initial={{ opacity: 0, scale: 0.8, y: 12 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
    whileTap={{ scale: 0.95 }}
    className={cn(
      'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center',
      'rounded-2xl shadow-lg bg-indigo-500 text-white hover:bg-indigo-600',
      'focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2',
      className
    )}
  >
    <MessageCircle className="h-7 w-7" strokeWidth={2} aria-hidden />
  </motion.button>
);
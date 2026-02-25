'use client';

import { motion } from 'motion/react';

export const RemoteLoaderSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2 }}
    className="h-full min-h-[240px] min-w-0 rounded-xl bg-gray-200/80 animate-pulse"
    aria-label="Загрузка"
  />
);
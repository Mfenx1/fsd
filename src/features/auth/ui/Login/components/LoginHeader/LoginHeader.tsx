import { memo } from 'react';
import { LogIn } from 'lucide-react';

const LoginHeaderComponent = () => (
  <div className="flex flex-col items-center gap-3 text-center mb-8">
    <LogIn className="text-blue-600 dark:text-blue-400" size={40} aria-hidden />
    <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">Добро пожаловать!</h1>
    <p className="text-sm text-gray-500 dark:text-zinc-400">Пожалуйста, авторизируйтесь</p>
  </div>
);

export const LoginHeader = memo(LoginHeaderComponent);
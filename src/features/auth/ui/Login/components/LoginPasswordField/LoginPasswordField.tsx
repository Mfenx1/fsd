import { useCallback, useRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { ErrorTooltip, type LoginFormValues } from '$shared';

interface LoginPasswordFieldProps {
  onClearApiError: () => void;
}

const inputBase =
  'flex-1 min-w-0 h-10 pl-11 pr-12 text-sm bg-zinc-100/80 dark:bg-zinc-700/50 border border-zinc-200/60 dark:border-zinc-600 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export const LoginPasswordField = ({ onClearApiError }: LoginPasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const handleTogglePassword = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );
  const { register, formState } = useFormContext<LoginFormValues>();
  const { errors, isSubmitting } = formState;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="password" className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
        Пароль
      </label>
      <div ref={wrapperRef} className="relative flex items-center w-full">
        {errors.password && (
          <ErrorTooltip
            id="login-password-error"
            message={errors.password.message ?? ''}
            anchorRef={wrapperRef}
          />
        )}
        <span className="
          absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-zinc-600 dark:text-zinc-300
        " aria-hidden>
          <Lock size={20} />
        </span>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          {...register('password', { onChange: onClearApiError })}
          className={inputBase}
          autoComplete="current-password"
          disabled={isSubmitting}
          aria-invalid={errors.password ? 'true' : 'false'}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
        />
        <button
          type="button"
          className="
            absolute right-3 top-1/2 -translate-y-1/2 flex items-center
            justify-center bg-transparent border-0 cursor-pointer p-1 shrink-0
            text-zinc-600 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-zinc-100
          "
          onClick={handleTogglePassword}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>
      </div>
    </div>
  );
};
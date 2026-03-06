import { useRef } from 'react';
import { Mail, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { ErrorTooltip, type LoginFormValues } from '$shared';

interface LoginUsernameFieldProps {
  onClearApiError: () => void;
}

const inputBase =
  'flex-1 min-w-0 h-10 pl-11 pr-10 text-sm bg-zinc-100/80 dark:bg-zinc-700/50 border border-zinc-200/60 dark:border-zinc-600 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

export const LoginUsernameField = ({ onClearApiError }: LoginUsernameFieldProps) => {
  const {
    register,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<LoginFormValues>();

  const username = watch('username');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClear = () => {
    setValue('username', '');
    clearErrors('username');
    onClearApiError();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="username" className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
        Почта
      </label>
      <div ref={wrapperRef} className="relative flex items-center w-full">
        {errors.username && (
          <ErrorTooltip
            id="login-email-error"
            message={errors.username.message ?? ''}
            anchorRef={wrapperRef}
          />
        )}
        <span className="
          absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-zinc-600 dark:text-zinc-300
        " aria-hidden>
          <Mail size={20} />
        </span>
        <input
          id="username"
          type="text"
          {...register('username', { onChange: onClearApiError })}
          className={inputBase}
          autoComplete="username"
          disabled={isSubmitting}
          aria-invalid={errors.username ? 'true' : 'false'}
          aria-describedby={errors.username ? 'login-email-error' : undefined}
        />
        {username ? (
          <button
            type="button"
            className="
              absolute right-3 top-1/2 -translate-y-1/2 flex items-center
              justify-center bg-transparent border-0 cursor-pointer p-1
              text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100
              disabled:opacity-50
            "
            onClick={handleClear}
            aria-label="Очистить почту"
            disabled={isSubmitting}
          >
            <X size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
};
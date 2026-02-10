import { useRef } from 'react';
import { Mail, X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { ErrorTooltip } from '$components/ErrorTooltip';
import type { LoginFormValues } from '$schemas';

interface LoginUsernameFieldProps {
  onClearApiError: () => void;
}

const inputBase =
  'flex-1 min-w-0 py-2.5 pl-11 pr-10 text-base bg-white border border-gray-200 rounded-lg text-gray-900 outline-none focus:border-blue-600 placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed';

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
      <label htmlFor="username" className="text-sm font-medium text-gray-900">
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
          absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none
        " aria-hidden>
          <Mail size={20} color="#6b7280" />
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
              text-gray-400
              hover:text-gray-900
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

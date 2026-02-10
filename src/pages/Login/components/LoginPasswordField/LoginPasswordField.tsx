import { useCallback, useRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { ErrorTooltip } from '$components/ErrorTooltip';
import type { LoginFormValues } from '$schemas';

interface LoginPasswordFieldProps {
  onClearApiError: () => void;
}

const inputBase =
  'flex-1 min-w-0 py-2.5 pl-11 pr-12 text-base bg-white border border-gray-200 rounded-lg text-gray-900 outline-none focus:border-blue-600 placeholder:text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed';

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
      <label htmlFor="password" className="text-sm font-medium text-gray-900">
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
          absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none
        " aria-hidden>
          <Lock size={20} color="#a6aab3" />
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
          "
          onClick={handleTogglePassword}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {showPassword ? (
            <EyeOff size={20} color="#a6aab3" />
          ) : (
            <Eye size={20} color="#a6aab3" />
          )}
        </button>
      </div>
    </div>
  );
};

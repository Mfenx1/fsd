import { useFormContext } from 'react-hook-form';
import type { LoginFormValues } from '$shared';

export const LoginRememberCheckbox = () => {
  const { register, formState } = useFormContext<LoginFormValues>();

  return (
    <div className="flex items-center gap-2">
      <input
        id="remember"
        type="checkbox"
        {...register('rememberMe')}
        className="checkbox-custom"
        disabled={formState.isSubmitting}
      />
      <label htmlFor="remember" className="text-sm text-gray-500 dark:text-zinc-400 cursor-pointer">
        Запомнить данные
      </label>
    </div>
  );
};
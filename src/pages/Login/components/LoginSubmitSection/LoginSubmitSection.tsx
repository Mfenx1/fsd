import { memo } from 'react';
import { Loader } from '$components';

interface LoginSubmitSectionProps {
  isSubmitting: boolean;
}

const LoginSubmitSectionComponent = ({ isSubmitting }: LoginSubmitSectionProps) => (
  <>
    <div className="relative">
      <button
        type="submit"
        className="
          w-full py-3 px-4 text-base font-semibold bg-blue-600 text-white
          border-0 rounded-lg cursor-pointer
          hover:enabled:bg-blue-700
          disabled:opacity-60 disabled:cursor-not-allowed
        "
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader size="sm" /> : 'Войти'}
      </button>
    </div>
    <p className="text-center text-sm text-gray-500 my-1">или</p>
    <p className="text-center text-sm text-gray-500">
      Нет аккаунта?{' '}
      <span className="
        text-blue-600 underline cursor-pointer
        hover:text-blue-700
      ">Создать</span>
    </p>
  </>
);

export const LoginSubmitSection = memo(LoginSubmitSectionComponent);

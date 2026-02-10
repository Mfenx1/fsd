import { memo, type ReactNode } from 'react';

export interface DefaultErrorFallbackProps {
  error: Error;
  reset: () => void;
}

const DefaultErrorFallbackComponent = ({ error, reset }: DefaultErrorFallbackProps): ReactNode => (
  <div
    className="
      flex flex-col items-center justify-center min-h-dvh py-6 px-6 bg-white
      text-gray-900 text-center
    "
    role="alert"
    aria-live="assertive"
  >
    <h2 className="m-0 mb-2 text-xl font-bold text-gray-900">Что-то пошло не так</h2>
    <p className="m-0 mb-4 text-sm text-gray-500 max-w-96 break-words">{error.message}</p>
    <button
      type="button"
      className="
        py-3 px-5 text-sm font-semibold bg-blue-600 text-white border-0
        rounded-lg cursor-pointer
        hover:bg-blue-700
      "
      onClick={reset}
    >
      Попробовать снова
    </button>
  </div>
);

export const DefaultErrorFallback = memo(DefaultErrorFallbackComponent);

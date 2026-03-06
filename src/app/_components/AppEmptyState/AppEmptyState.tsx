type AppEmptyStateProps = {
  title: string;
  message?: string;
  children: React.ReactNode;
  
  alert?: boolean;
};

const containerClass =
  'flex flex-col items-center justify-center min-h-dvh py-6 px-6 bg-white text-gray-900 text-center';
const titleClass = 'm-0 mb-2 text-xl font-bold text-gray-900';
const messageClass = 'm-0 mb-4 text-sm text-gray-500 max-w-96 break-words';

export const AppEmptyState = ({ title, message, children, alert: isAlert }: AppEmptyStateProps) => (
  <div
    className={containerClass}
    role={isAlert ? 'alert' : 'status'}
    {...(isAlert ? { 'aria-live': 'assertive' as const } : {})}
  >
    <h2 className={titleClass}>{title}</h2>
    {message != null && <p className={messageClass}>{message}</p>}
    <div className="flex items-center gap-3">{children}</div>
  </div>
);

export const primaryButtonClass =
  'py-3 px-5 text-sm font-semibold bg-blue-600 text-white border-0 rounded-lg cursor-pointer hover:bg-blue-700';
export const linkToHomeClass =
  'inline-block py-3 px-5 text-sm font-semibold bg-blue-600 text-white border-0 rounded-lg no-underline hover:bg-blue-700';
export const secondaryLinkClass =
  'py-3 px-5 text-sm font-semibold text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50';
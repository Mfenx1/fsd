'use client';


const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          padding: 24,
          boxSizing: 'border-box',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#fafafa',
          color: '#18181b',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          role="alert"
          aria-live="assertive"
          style={{
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          <h1
            style={{
              margin: '0 0 8px',
              fontSize: '1.25rem',
              fontWeight: 700,
            }}
          >
            Что-то пошло не так
          </h1>
          <p
            style={{
              margin: '0 0 16px',
              fontSize: '0.875rem',
              color: '#71717a',
              wordBreak: 'break-word',
            }}
          >
            {error.message}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: '12px 20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Попробовать снова
            </button>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '12px 20px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#4f46e5',
                border: '1px solid #4f46e5',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              На главную
            </a>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
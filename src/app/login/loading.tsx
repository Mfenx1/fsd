const LoginLoading = () => (
  <div
    className="flex flex-col items-center justify-center min-h-dvh bg-gray-50 p-6"
    aria-label="Загрузка"
  >
    <div className="w-full max-w-[22rem] flex flex-col gap-5 p-6 bg-white rounded-xl shadow-sm">
      <div className="h-7 w-24 rounded bg-gray-200" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-16 rounded bg-gray-100" />
        <div className="h-11 rounded-lg bg-gray-200" />
        <div className="h-4 w-20 rounded bg-gray-100" />
        <div className="h-11 rounded-lg bg-gray-200" />
      </div>
      <div className="h-11 rounded-lg bg-gray-200" />
    </div>
  </div>
);

export default LoginLoading;
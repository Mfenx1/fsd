'use client';

import { RootError } from './_components/RootError';

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => <RootError error={error} reset={reset} />;

export default Error;
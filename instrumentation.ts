
export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateServerEnv } = await import('./src/shared/config');

    validateServerEnv();
  }
};
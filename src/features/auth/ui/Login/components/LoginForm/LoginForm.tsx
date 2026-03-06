import { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toast, getDefaultRememberMe, loginSchema, type LoginFormValues } from '$shared';
import { useAuth } from '$features/auth';
import {
  LoginPasswordField,
  LoginRememberCheckbox,
  LoginSubmitSection,
  LoginUsernameField,
} from '../index';

export const LoginForm = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const { login, isLoggingIn } = useAuth();

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: getDefaultRememberMe(),
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);
    const err = await login(data.username, data.password, data.rememberMe);
    if (err) setApiError(err);
  };

  const onClearApiError = useCallback(() => setApiError(null), []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="
        flex flex-col gap-5
      ">
        <LoginUsernameField onClearApiError={onClearApiError} />
        <LoginPasswordField onClearApiError={onClearApiError} />
        <LoginRememberCheckbox />
        <LoginSubmitSection isSubmitting={methods.formState.isSubmitting || isLoggingIn} />
      </form>
      {apiError && (
        <Toast
          message={apiError}
          variant="error"
          position="top-center"
          onClose={onClearApiError}
        />
      )}
    </FormProvider>
  );
};
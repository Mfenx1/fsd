import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isOk, queryKeys } from '$lib';
import { login as loginApi } from '$services';
import type { LoginResponse, LoginVariables } from '$types';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginVariables) => {
      const res = await loginApi(payload);
      if (!isOk(res)) throw new Error(res.error.message);

      return res.data;
    },
    onSuccess: (data: LoginResponse) => {
      queryClient.setQueryData(queryKeys.auth.me(data.accessToken), {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      });
    },
  });
};

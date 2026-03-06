import { useQuery } from '@tanstack/react-query';
import { isOk, queryKeys } from '$shared';
import { fetchMe } from '$features/auth';

export const useMeQuery = (token: string | null) =>
  useQuery({
    queryKey: queryKeys.auth.me(token),
    queryFn: async () => {
      const res = await fetchMe(token!);
      if (!isOk(res)) throw new Error(res.error.message);

      return res.data;
    },
    enabled: Boolean(token),
    staleTime: 0,
    retry: false,
  });
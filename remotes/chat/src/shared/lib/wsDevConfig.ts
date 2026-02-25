import { WS_CONFIG } from '$shared/constants';

interface WsUrlState {
  getWsUrl: () => string;
  toggleFakeUrl: () => void;
  isFakeUrl: () => boolean;
}

const createWsUrlState = (): WsUrlState => {
  let useFakeUrl = false;

  return {
    getWsUrl: (): string => (useFakeUrl ? WS_CONFIG.URL_FAKE : WS_CONFIG.URL),
    toggleFakeUrl: (): void => {
      useFakeUrl = !useFakeUrl;
    },
    isFakeUrl: (): boolean => useFakeUrl,
  };
};

const wsUrlState = createWsUrlState();

export const getWsUrl = (): string => wsUrlState.getWsUrl();
export const toggleFakeUrl = (): void => wsUrlState.toggleFakeUrl();
export const isFakeUrl = (): boolean => wsUrlState.isFakeUrl();
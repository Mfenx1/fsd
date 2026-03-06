import { RECONNECT_MODE } from '$shared/constants';
import type { ReconnectModeKey } from '$shared/types';

export interface ConnectionStateApi {
  getReconnectMode: () => ReconnectModeKey;
  setReconnectMode: (mode: ReconnectModeKey) => void;
  getIsManuallyDisconnected: () => boolean;
  setIsManuallyDisconnected: (value: boolean) => void;
}

export const createConnectionState = (): ConnectionStateApi => {
  let reconnectMode: ReconnectModeKey = RECONNECT_MODE.AUTO;
  let isManuallyDisconnected = false;

  return {
    getReconnectMode: () => reconnectMode,
    setReconnectMode: (mode) => {
      reconnectMode = mode;
    },
    getIsManuallyDisconnected: () => isManuallyDisconnected,
    setIsManuallyDisconnected: (value) => {
      isManuallyDisconnected = value;
    },
  };
};

export const connectionState = createConnectionState();
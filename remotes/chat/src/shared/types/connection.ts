import { RECONNECT_MODE } from '$shared/constants';
import type { ConnectionStatusValue } from '$shared/constants/statuses';
import type { ValueOf } from './valueOf';

export type ConnectionStatus = ConnectionStatusValue;

export type ReconnectModeKey = ValueOf<typeof RECONNECT_MODE>;
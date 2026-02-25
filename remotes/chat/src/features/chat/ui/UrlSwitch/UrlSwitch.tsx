import { useCallback, useState } from 'react';

import { useDisconnectSocket, useReconnectSocket } from '../../api/chatApi';
import { delay, isFakeUrl, toggleFakeUrl } from '$shared/lib';

import styles from './UrlSwitch.module.css';

export const UrlSwitch = () => {
  const [checked, setChecked] = useState(() => isFakeUrl());
  const onDisconnect = useDisconnectSocket();
  const onReconnect = useReconnectSocket();

  const handleToggle = useCallback(async () => {
    onDisconnect();
    toggleFakeUrl();
    setChecked((prev) => !prev);
    await delay(100);
    onReconnect();
  }, [onDisconnect, onReconnect]);

  return (
    <label
      className={styles.switch}
      title={`URL: ${checked ? 'фейк' : 'обычный'}`}
      data-testid="url-switch"
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleToggle}
        aria-label="Переключить URL (обычный / фейк)"
      />
      <span className={styles.slider} />
    </label>
  );
};
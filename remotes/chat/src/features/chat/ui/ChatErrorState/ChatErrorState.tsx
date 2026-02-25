import styles from './ChatErrorState.module.css';

export const ChatErrorState = () => (
  <div className={styles.container}>
    <div
      className={styles.errorState}
      role="alert"
      aria-live="assertive"
      aria-label="Ошибка загрузки чата"
    >
      <p className={styles.errorStateText}>Не удалось загрузить чат</p>
      <p className={styles.errorStateHint}>Проверьте соединение и обновите страницу</p>
    </div>
  </div>
);
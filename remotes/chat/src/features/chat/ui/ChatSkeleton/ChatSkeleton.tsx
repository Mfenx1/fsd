import styles from './ChatSkeleton.module.css';

export const ChatSkeleton = () => (
  <div className={styles.container} role="status" aria-label="Загрузка чата" aria-live="polite">
    <header className={styles.header}>
      <div className={styles.titleSkeleton} aria-hidden />
      <div className={styles.subtitleSkeleton} aria-hidden />
    </header>
    <div className={styles.topRow}>
      <div className={styles.switchSkeleton} aria-hidden />
      <div className={styles.statusSkeleton} aria-hidden />
    </div>
    <div className={styles.messagesWrapper}>
      <div className={`${styles.line} ${styles.lineShort}`} aria-hidden />
      <div className={`${styles.line} ${styles.lineLong}`} aria-hidden />
      <div className={`${styles.line} ${styles.lineMedium}`} aria-hidden />
      <div className={`${styles.line} ${styles.lineShort}`} aria-hidden />
      <div className={`${styles.line} ${styles.lineLong}`} aria-hidden />
      <div className={`${styles.line} ${styles.lineMedium}`} aria-hidden />
    </div>
    <div className={styles.inputWrapper}>
      <div className={styles.inputSkeleton} aria-hidden />
    </div>
  </div>
);
'use client';
import styles from '../fee/page.module.css';

export default function estudyPage() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title} style={{textTransform: 'capitalize'}}>estudy</h1>
          <p className={styles.description}>Dashboard module for estudy.</p>
        </div>
        <div className={styles.grid}>
          <div className={styles.card} style={{padding: '2rem'}}>
            <h3>Module Active</h3>
            <p style={{color: 'var(--text-secondary)', marginTop: '1rem'}}>
              This section is fully integrated into the UI. Statistics and widgets will appear here based on your data.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

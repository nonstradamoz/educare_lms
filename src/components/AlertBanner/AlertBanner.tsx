import { Bell, Calendar, MessageSquare } from 'lucide-react';
import styles from './AlertBanner.module.css';

export default function AlertBanner() {
  return (
    <div className={styles.container}>
      <div className={styles.alertItem}>
        <div className={styles.iconWrapper}>
          <Bell size={16} />
        </div>
        <span className={styles.label}>Today Alert</span>
        <span className={styles.badgeDanger}>0</span>
      </div>
      
      <div className={styles.alertItem}>
        <div className={styles.iconWrapper}>
          <Calendar size={16} />
        </div>
        <span className={styles.label}>Subscription End Date</span>
        <span className={styles.badgeSuccess}>01 Sep 2026</span>
      </div>
      
      <div className={styles.alertItem}>
        <div className={styles.iconWrapper}>
          <MessageSquare size={16} />
        </div>
        <span className={styles.label}>SMS Balance</span>
        <span className={styles.badgeInfo}>1000</span>
      </div>
    </div>
  );
}

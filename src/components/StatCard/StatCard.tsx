import { ElementType } from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  type: 'success' | 'warning' | 'danger' | 'info';
  fullWidth?: boolean;
}

export default function StatCard({ title, value, icon: Icon, type, fullWidth = false }: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[type]} ${fullWidth ? styles.fullWidth : ''}`}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.value}>{value}</p>
      </div>
      <div className={styles.iconWrapper}>
        <Icon size={24} strokeWidth={1.5} />
      </div>
    </div>
  );
}

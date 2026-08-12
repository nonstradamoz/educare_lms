import { ElementType } from 'react';
import styles from './PagePlaceholder.module.css';

interface PagePlaceholderProps {
  title: string;
  icon: ElementType;
  description: string;
  actionText?: string;
}

export default function PagePlaceholder({ title, icon: Icon, description, actionText }: PagePlaceholderProps) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <Icon size={48} strokeWidth={1} />
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
          {actionText && (
            <button className={styles.actionBtn}>
              {actionText}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

'use client';

import { Video } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const handleTrainingVideoClick = () => {
    alert("Opening full training video player...");
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.actions}>
        <button className={styles.trainingBtn} onClick={handleTrainingVideoClick}>
          <Video size={16} />
          Full Training Video
        </button>
      </div>
    </header>
  );
}

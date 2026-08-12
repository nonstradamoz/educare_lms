'use client';

import { Power } from 'lucide-react';
import styles from './UserBanner.module.css';

export default function UserBanner() {
  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      alert("Logging out...");
      // Add actual logout logic here
    }
  };

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>Logo</div>
        </div>
        <div className={styles.userInfo}>
          <h2 className={styles.name}>Akshay</h2>
          <p className={styles.institution}>Educare Kalathipady</p>
          <p className={styles.year}>2026-2027</p>
        </div>
      </div>
      <button className={styles.logoutBtn} aria-label="Logout" onClick={handleLogout}>
        <Power size={20} />
      </button>
    </div>
  );
}

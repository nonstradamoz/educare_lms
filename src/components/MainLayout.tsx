'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';
import styles from './MainLayout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={styles.shell}>
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div
        className={styles.body}
        style={{ marginLeft: isSidebarOpen ? '260px' : '72px' }}
      >
        <Header />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

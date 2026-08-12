'use client';

import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

const PAGE_TITLES: Record<string, string> = {
  '/':          'Dashboard',
  '/student':   'Student Management',
  '/live-class':'Live Class',
  '/fee':       'Fee Management',
  '/exam':      'Examinations',
  '/estudy':    'eStudy',
  '/certificate':'Certificates',
  '/staff':     'Staff & Users',
  '/leads':     'Enquiry & Leads',
  '/sms':       'SMS Gateway',
  '/expense':   'Expense & Income',
  '/report':    'Reports',
  '/settings':  'Settings',
  '/setup':     'System Setup',
  '/help':      'Help & Support',
};

export default function Header() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'EduCare';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>
      <div className={styles.right}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input className={styles.search} type="text" placeholder="Quick search…" />
        </div>
        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} />
          <span className={styles.notifDot} />
        </button>
        <div className={styles.avatar}>A</div>
      </div>
    </header>
  );
}

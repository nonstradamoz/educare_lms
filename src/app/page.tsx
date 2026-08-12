'use client';

import {
  FileSignature, FileEdit, BellRing, IndianRupee,
  ClipboardList, TrendingUp, Users, BookOpen,
  Bell, Calendar, MessageSquare
} from 'lucide-react';
import styles from './page.module.css';

const STATS = [
  { title: 'Total Students',   value: '1',      icon: Users,          color: 'blue',   change: '+0%' },
  { title: 'Today Inquiry',    value: '0',      icon: FileEdit,       color: 'violet', change: '—' },
  { title: 'Today Absent',     value: '0',      icon: BellRing,       color: 'amber',  change: '—' },
  { title: 'Today Income',     value: '₹0',     icon: TrendingUp,     color: 'green',  change: '—' },
  { title: 'Today Expense',    value: '₹0',     icon: IndianRupee,    color: 'amber',  change: '—' },
  { title: 'Today Refund',     value: '₹0',     icon: IndianRupee,    color: 'red',    change: '—' },
  { title: 'Today Fee Due',    value: '₹0',     icon: ClipboardList,  color: 'amber',  change: '—' },
  { title: 'Fee Overdue',      value: '₹0',     icon: BellRing,       color: 'red',    change: '—' },
  { title: 'Upcoming Fee Due', value: '₹0',     icon: Calendar,       color: 'violet', change: '—' },
  { title: 'Pending Fees',     value: '₹20,000',icon: FileSignature,  color: 'red',    change: '—' },
  { title: 'eStudy Materials', value: '0',      icon: BookOpen,       color: 'blue',   change: '—' },
  { title: 'SMS Balance',      value: '1,000',  icon: MessageSquare,  color: 'green',  change: '—' },
];

const ALERTS = [
  { icon: Bell,        label: 'Today Alerts',          badge: '0',          badgeType: 'danger' },
  { icon: Calendar,    label: 'Subscription End Date',  badge: '01 Sep 2026',badgeType: 'success' },
  { icon: MessageSquare,label:'SMS Balance',            badge: '1,000',      badgeType: 'info' },
];

export default function Home() {
  return (
    <div className={styles.page}>

      {/* ── User Welcome Banner ── */}
      <div className={styles.banner}>
        <div className={styles.bannerLeft}>
          <div className={styles.bannerAvatar}>A</div>
          <div>
            <h2 className={styles.bannerName}>Akshay</h2>
            <p className={styles.bannerSub}>Educare Kalathipady &nbsp;·&nbsp; 2026–2027</p>
          </div>
        </div>
        <div className={styles.bannerRight}>
          <span className={styles.bannerBadge}>Admin</span>
        </div>
      </div>

      {/* ── Alert Strip ── */}
      <div className={styles.alertStrip}>
        {ALERTS.map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.label} className={styles.alertItem}>
              <div className={styles.alertIconWrap}><Icon size={15} /></div>
              <span className={styles.alertLabel}>{a.label}</span>
              <span className={`${styles.alertBadge} ${styles[a.badgeType]}`}>{a.badge}</span>
            </div>
          );
        })}
      </div>

      {/* ── Stats Grid ── */}
      <div className={styles.statsGrid}>
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className={`${styles.statCard} ${styles[s.color]}`}>
              <div className={styles.statIcon}><Icon size={20} strokeWidth={1.8} /></div>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statTitle}>{s.title}</div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ── */}
      <div className={styles.quickActions}>
        <button className={styles.actionBtn} onClick={() => alert('Loading full analytics...')}>
          View Full Report
        </button>
      </div>

    </div>
  );
}

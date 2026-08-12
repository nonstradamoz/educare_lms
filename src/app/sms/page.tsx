'use client';
import s from '@/styles/shared.module.css';

export default function Page() {
  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>SMS Gateway</h1>
          <p className={s.pageDesc}>Send bulk SMS notifications to students and parents.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>SMS Balance</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>Current balance: 1,000 SMS credits. Bulk messaging is available for fee reminders, exam alerts, and attendance notifications.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Templates</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>Pre-built templates for fee due reminders, exam schedules, holiday announcements, and custom messages.</p>
        </div>
      </div>
    </div>
  );
}

'use client';
import s from '@/styles/shared.module.css';

export default function Page() {
  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Live Class</h1>
          <p className={s.pageDesc}>Schedule and manage live online classes.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Upcoming Classes</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>No live classes are currently scheduled. Click "Add Record" to schedule a new class session with a meeting link and time slot.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>How It Works</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>Live classes are conducted via integrated video conferencing. Students receive automatic notifications before each session starts.</p>
        </div>
      </div>
    </div>
  );
}

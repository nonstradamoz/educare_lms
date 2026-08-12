'use client';
import s from '@/styles/shared.module.css';

export default function Page() {
  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Help & Support</h1>
          <p className={s.pageDesc}>Get help and access documentation.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Contact Support</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>Email: support@educare.in · Phone: +91 9876543210 · Hours: Mon–Sat, 9am–6pm IST.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Documentation</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>Full documentation and video tutorials are available at docs.educare.in. You can also watch the training video from the top right button in the header.</p>
        </div>
      </div>
    </div>
  );
}

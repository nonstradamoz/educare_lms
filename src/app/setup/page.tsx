'use client';
import s from '@/styles/shared.module.css';

export default function Page() {
  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>System Setup</h1>
          <p className={s.pageDesc}>Configure initial system parameters and school details.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Academic Year</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>Current academic year: 2026–2027. You can configure term dates, holidays, and grading schemes here.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Integrations</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>Connect to payment gateways (Razorpay, PayU), SMS providers (TextLocal, MSG91), and email services (SendGrid).</p>
        </div>
      </div>
    </div>
  );
}

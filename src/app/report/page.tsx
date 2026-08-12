'use client';
import s from '@/styles/shared.module.css';

export default function Page() {
  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Reports</h1>
          <p className={s.pageDesc}>Generate and export detailed reports.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Available Reports</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>Student Attendance Report · Fee Collection Summary · Exam Result Sheet · Staff Performance Report · Monthly Expense Statement.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Export Options</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>All reports can be exported as PDF or Excel (.xlsx) format. You can also schedule automatic email delivery of reports.</p>
        </div>
      </div>
    </div>
  );
}

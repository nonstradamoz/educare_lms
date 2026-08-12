'use client';
import s from '@/styles/shared.module.css';

export default function Page() {
  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Expense & Income</h1>
          <p className={s.pageDesc}>Track all income and expense transactions.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Summary</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>Total Income this month: ₹0 · Total Expenses: ₹0 · Net Balance: ₹0. Add income or expense entries to start tracking your finances.</p>
        </div>
      </div>

      <div className={s.card}>
        <div className={s.cardHeader}><h2 className={s.cardTitle}>Categories</h2></div>
        <div className={s.cardBody} style={{ color: 'var(--text-2)', fontSize: '0.875rem', lineHeight: '1.75' }}>
          <p>Income categories: Tuition Fees, Donations, Government Grants. Expense categories: Salaries, Infrastructure, Utilities, Events.</p>
        </div>
      </div>
    </div>
  );
}

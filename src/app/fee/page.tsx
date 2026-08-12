'use client';

import { useState } from 'react';
import { IndianRupee, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Button from '@/components/UI/Button/Button';
import Input from '@/components/UI/Input/Input';
import s from '@/styles/shared.module.css';

interface Transaction { id: string; studentId: string; amount: number; date: string; type: 'Payment' | 'Refund'; }

const MOCK_TXN: Transaction[] = [
  { id: 'TXN-001', studentId: 'STU-001', amount: 5000,  date: '2026-08-12', type: 'Payment' },
  { id: 'TXN-002', studentId: 'STU-002', amount: 12000, date: '2026-08-10', type: 'Payment' },
  { id: 'TXN-003', studentId: 'STU-003', amount: 2000,  date: '2026-08-08', type: 'Refund' },
];

export default function FeePage() {
  const [txns, setTxns]       = useState<Transaction[]>(MOCK_TXN);
  const [studentId, setSid]   = useState('');
  const [amount, setAmt]      = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !amount) return;
    const t: Transaction = { id: `TXN-00${txns.length + 1}`, studentId, amount: parseFloat(amount), date: new Date().toISOString().split('T')[0], type: 'Payment' };
    setTxns([t, ...txns]); setSid(''); setAmt(''); setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Fee Management</h1>
          <p className={s.pageDesc}>Record student payments and view transaction history.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Form Card */}
        <div className={s.card}>
          <div className={s.cardHeader}><h2 className={s.cardTitle}>Record Payment</h2></div>
          <div className={s.cardBody}>
            <form onSubmit={handleSubmit} className={s.form}>
              <Input label="Student ID"  placeholder="e.g. STU-001"  value={studentId} onChange={e => setSid(e.target.value)} required />
              <Input label="Amount (₹)"  type="number" placeholder="e.g. 5000"  value={amount}    onChange={e => setAmt(e.target.value)} required />
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['Cash','Card','UPI'].map(m => (
                  <label key={m} style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:'0.875rem', cursor:'pointer', color:'var(--text-1)' }}>
                    <input type="radio" name="method" defaultChecked={m === 'Cash'} /> {m}
                  </label>
                ))}
              </div>
              <Button type="submit" style={{ width: '100%' }}>
                <IndianRupee size={15} /> Record Payment
              </Button>
              {success && (
                <div className={s.successMsg}>
                  <CheckCircle2 size={15} /> Payment recorded successfully!
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Transactions Card */}
        <div className={s.card}>
          <div className={s.cardHeader}><h2 className={s.cardTitle}>Recent Transactions</h2></div>
          {txns.map(t => (
            <div key={t.id} className={s.listItem}>
              <div className={`${s.listIconWrap} ${t.type === 'Payment' ? s.success : s.warning}`}>
                {t.type === 'Payment' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
              </div>
              <div className={s.listDetails}>
                <div className={s.listTitle}>{t.id}</div>
                <div className={s.listSub}>{t.studentId} · {t.date}</div>
              </div>
              <div className={`${s.listValue} ${t.type === 'Payment' ? s.success : s.warning}`}>
                {t.type === 'Payment' ? '+' : '-'}₹{t.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

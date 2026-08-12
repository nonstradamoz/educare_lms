'use client';

import { useState } from 'react';
import { IndianRupee, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Button from '@/components/UI/Button/Button';
import Input from '@/components/UI/Input/Input';
import styles from './page.module.css';

interface Transaction {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  type: 'Payment' | 'Refund';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-001', studentId: 'STU-001', amount: 5000, date: '2026-08-12', type: 'Payment' },
  { id: 'TXN-002', studentId: 'STU-002', amount: 12000, date: '2026-08-10', type: 'Payment' },
  { id: 'TXN-003', studentId: 'STU-003', amount: 2000, date: '2026-08-08', type: 'Refund' },
];

export default function FeePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !amount) return;
    
    const newTxn: Transaction = {
      id: `TXN-00${transactions.length + 1}`,
      studentId,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
      type: 'Payment'
    };
    
    setTransactions([newTxn, ...transactions]);
    setStudentId('');
    setAmount('');
    
    // Show success toast briefly
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Fee Management</h1>
            <p className={styles.description}>Record student payments and view transaction history.</p>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Record Payment Form */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Record Payment</h2>
            </div>
            <form onSubmit={handleRecordPayment} className={styles.form}>
              <Input 
                label="Student ID" 
                placeholder="e.g. STU-001" 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
              <Input 
                label="Amount (₹)" 
                type="number"
                placeholder="e.g. 5000" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              
              <div className={styles.paymentMethods}>
                <label className={styles.radioLabel}>
                  <input type="radio" name="paymentMethod" defaultChecked /> Cash
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="paymentMethod" /> Card
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="paymentMethod" /> UPI
                </label>
              </div>

              <Button type="submit" className={styles.submitBtn}>
                <IndianRupee size={16} /> Record Payment
              </Button>
              
              {showSuccess && (
                <div className={styles.successMessage}>
                  <CheckCircle2 size={16} /> Payment recorded successfully!
                </div>
              )}
            </form>
          </div>

          {/* Recent Transactions List */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Transactions</h2>
            </div>
            <div className={styles.transactionList}>
              {transactions.map(txn => (
                <div key={txn.id} className={styles.transactionItem}>
                  <div className={`${styles.txnIcon} ${txn.type === 'Payment' ? styles.iconSuccess : styles.iconWarning}`}>
                    {txn.type === 'Payment' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div className={styles.txnDetails}>
                    <div className={styles.txnId}>{txn.id}</div>
                    <div className={styles.txnStudent}>{txn.studentId} • {txn.date}</div>
                  </div>
                  <div className={`${styles.txnAmount} ${txn.type === 'Payment' ? styles.textSuccess : styles.textWarning}`}>
                    {txn.type === 'Payment' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

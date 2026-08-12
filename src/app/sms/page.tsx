'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import Button from '@/components/UI/Button/Button';
import Input from '@/components/UI/Input/Input';
import styles from '../fee/page.module.css'; // Reusing form styles

export default function SMSGatewayPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>SMS Gateway</h1>
          <p className={styles.description}>Send bulk SMS notifications to students and staff.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Configure SMS Gateway</h2>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input label="Primary Target" placeholder="Enter details..." required />
            <Input label="Additional Info" placeholder="Optional..." />
            
            <Button type="submit" className={styles.submitBtn}>
              <Send size={16} /> Submit & Save
            </Button>
            
            {showSuccess && (
              <div className={styles.successMessage}>
                <CheckCircle2 size={16} /> Action completed successfully!
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

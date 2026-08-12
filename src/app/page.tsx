'use client';

import { 
  FileSignature, 
  FileEdit, 
  BellRing, 
  IndianRupee, 
  ClipboardList 
} from 'lucide-react';
import UserBanner from '@/components/UserBanner/UserBanner';
import AlertBanner from '@/components/AlertBanner/AlertBanner';
import StatCard from '@/components/StatCard/StatCard';
import styles from './page.module.css';

export default function Home() {
  const handleViewMore = () => {
    alert("Loading more details and statistics...");
  };

  return (
    <>
      <div className={styles.container}>
        <UserBanner />
        <AlertBanner />
        
        <div className={styles.statsGrid}>
          <StatCard 
            title="Total Students" 
            value="1" 
            icon={FileSignature} 
            type="success" 
          />
          <StatCard 
            title="Today Inquiry" 
            value="0" 
            icon={FileEdit} 
            type="success" 
          />
          <StatCard 
            title="Today Absent" 
            value="0" 
            icon={BellRing} 
            type="danger" 
          />
          <StatCard 
            title="Today Income" 
            value="0" 
            icon={IndianRupee} 
            type="success" 
          />
          <StatCard 
            title="Today Expense" 
            value="0" 
            icon={IndianRupee} 
            type="warning" 
          />
          <StatCard 
            title="Today Refund" 
            value="0" 
            icon={IndianRupee} 
            type="warning" 
          />
          <StatCard 
            title="Today Fee Due" 
            value="0" 
            icon={BellRing} 
            type="danger" 
          />
          <StatCard 
            title="Fee Over Due" 
            value="0" 
            icon={BellRing} 
            type="danger" 
          />
          <StatCard 
            title="Upcoming Fee Due" 
            value="0" 
            icon={ClipboardList} 
            type="warning" 
          />
          <StatCard 
            title="Total Pending Fee" 
            value="20000" 
            icon={IndianRupee} 
            type="warning"
            fullWidth={true}
          />
        </div>
        
        <div className={styles.actionContainer}>
          <button className={styles.viewMoreBtn} onClick={handleViewMore}>VIEW MORE DETAILS</button>
        </div>
      </div>
    </>
  );
}

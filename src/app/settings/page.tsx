'use client';

import { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import Button from '@/components/UI/Button/Button';
import Input from '@/components/UI/Input/Input';
import styles from './page.module.css';

type Tab = 'General' | 'Security' | 'Notifications';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('General');
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock State for General Settings
  const [schoolName, setSchoolName] = useState('Educare Kalathipady');
  const [email, setEmail] = useState('admin@educare.com');
  const [phone, setPhone] = useState('+91 9876543210');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.description}>Manage your application preferences and account settings.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'General' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('General')}
            >
              General
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'Security' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('Security')}
            >
              Security
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'Notifications' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('Notifications')}
            >
              Notifications
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'General' && (
              <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.formGrid}>
                  <Input 
                    label="Institution Name" 
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                  <Input 
                    label="Contact Email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input 
                    label="Phone Number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Input 
                    label="Address" 
                    placeholder="Enter full address" 
                  />
                </div>
                
                <div className={styles.formActions}>
                  {showSuccess && (
                    <span className={styles.successMessage}>
                      <CheckCircle2 size={16} /> Settings saved successfully!
                    </span>
                  )}
                  <Button type="submit">
                    <Save size={16} /> Save Changes
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'Security' && (
              <form onSubmit={handleSave} className={styles.form}>
                <h3 className={styles.sectionTitle}>Change Password</h3>
                <div className={styles.formGrid}>
                  <Input 
                    label="Current Password" 
                    type="password"
                    placeholder="••••••••" 
                  />
                  <div className={styles.spacer}></div>
                  <Input 
                    label="New Password" 
                    type="password"
                    placeholder="••••••••" 
                  />
                  <Input 
                    label="Confirm New Password" 
                    type="password"
                    placeholder="••••••••" 
                  />
                </div>
                
                <div className={styles.formActions}>
                  {showSuccess && (
                    <span className={styles.successMessage}>
                      <CheckCircle2 size={16} /> Password updated!
                    </span>
                  )}
                  <Button type="submit">
                    <Save size={16} /> Update Password
                  </Button>
                </div>
              </form>
            )}

            {activeTab === 'Notifications' && (
              <form onSubmit={handleSave} className={styles.form}>
                <div className={styles.notificationList}>
                  <div className={styles.toggleRow}>
                    <div>
                      <h4 className={styles.toggleTitle}>Email Alerts</h4>
                      <p className={styles.toggleDesc}>Receive daily summary reports via email.</p>
                    </div>
                    <label className={styles.switch}>
                      <input type="checkbox" defaultChecked />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  
                  <div className={styles.toggleRow}>
                    <div>
                      <h4 className={styles.toggleTitle}>SMS Notifications</h4>
                      <p className={styles.toggleDesc}>Alert students automatically on fee dues.</p>
                    </div>
                    <label className={styles.switch}>
                      <input type="checkbox" defaultChecked />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  {showSuccess && (
                    <span className={styles.successMessage}>
                      <CheckCircle2 size={16} /> Preferences saved!
                    </span>
                  )}
                  <Button type="submit">
                    <Save size={16} /> Save Preferences
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

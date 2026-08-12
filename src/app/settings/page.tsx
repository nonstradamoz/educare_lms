'use client';

import { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import Button from '@/components/UI/Button/Button';
import Input from '@/components/UI/Input/Input';
import s from '@/styles/shared.module.css';

type Tab = 'General' | 'Security' | 'Notifications';

export default function SettingsPage() {
  const [tab, setTab]           = useState<Tab>('General');
  const [saved, setSaved]       = useState(false);
  const [schoolName, setSchool] = useState('Educare Kalathipady');
  const [email, setEmail]       = useState('admin@educare.com');
  const [phone, setPhone]       = useState('+91 9876543210');

  const save = (e: React.FormEvent) => {
    e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const TABS: Tab[] = ['General', 'Security', 'Notifications'];

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Settings</h1>
          <p className={s.pageDesc}>Manage application preferences and account settings.</p>
        </div>
      </div>

      <div className={s.card}>
        {/* Tabs */}
        <div className={s.tabs}>
          {TABS.map(t => (
            <button key={t} className={`${s.tabBtn} ${tab === t ? s.active : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        <div className={s.cardBody}>
          {tab === 'General' && (
            <form onSubmit={save} className={s.form}>
              <div className={s.formGrid}>
                <Input label="Institution Name" value={schoolName} onChange={e => setSchool(e.target.value)} />
                <Input label="Contact Email"    type="email" value={email} onChange={e => setEmail(e.target.value)} />
                <Input label="Phone Number"     value={phone} onChange={e => setPhone(e.target.value)} />
                <Input label="Address"          placeholder="Enter full address" />
              </div>
              <div className={s.formActions}>
                {saved && <div className={s.successMsg}><CheckCircle2 size={14} /> Settings saved!</div>}
                <Button type="submit"><Save size={14} /> Save Changes</Button>
              </div>
            </form>
          )}

          {tab === 'Security' && (
            <form onSubmit={save} className={s.form}>
              <div className={s.formGrid}>
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <div />
                <Input label="New Password"     type="password" placeholder="••••••••" />
                <Input label="Confirm Password" type="password" placeholder="••••••••" />
              </div>
              <div className={s.formActions}>
                {saved && <div className={s.successMsg}><CheckCircle2 size={14} /> Password updated!</div>}
                <Button type="submit"><Save size={14} /> Update Password</Button>
              </div>
            </form>
          )}

          {tab === 'Notifications' && (
            <form onSubmit={save} className={s.form}>
              {[
                { label: 'Email Alerts',       desc: 'Receive daily summary reports via email.' },
                { label: 'SMS Notifications',  desc: 'Alert students automatically on fee dues.' },
                { label: 'Push Notifications', desc: 'In-app push notifications for key events.' },
              ].map(n => (
                <div key={n.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:'1.25rem', borderBottom:'1px solid var(--border)' }}>
                  <div>
                    <p style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text-1)' }}>{n.label}</p>
                    <p style={{ fontSize:'0.8125rem', color:'var(--text-2)', marginTop:'0.2rem' }}>{n.desc}</p>
                  </div>
                  <label className={s.switch}>
                    <input type="checkbox" defaultChecked />
                    <span className={s.slider}></span>
                  </label>
                </div>
              ))}
              <div className={s.formActions}>
                {saved && <div className={s.successMsg}><CheckCircle2 size={14} /> Preferences saved!</div>}
                <Button type="submit"><Save size={14} /> Save Preferences</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical } from 'lucide-react';
import Button from '@/components/UI/Button/Button';
import Input from '@/components/UI/Input/Input';
import Modal from '@/components/UI/Modal/Modal';
import s from '@/styles/shared.module.css';

const MOCK = [["001","Arjun Nair","+91 9000000001","Full Stack Dev","Active"],["002","Sneha Pillai","+91 9000000002","Data Science","Active"],["003","Deepak Mohan","+91 9000000003","UI/UX Design","Inactive"]];

export default function Page() {
  const [rows, setRows] = useState(MOCK);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [newVal, setNewVal] = useState('');

  const filtered = rows.filter(r => r.some(c => String(c).toLowerCase().includes(search.toLowerCase())));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVal) return;
    setRows([...rows, [String(rows.length + 1).padStart(3, '0'), newVal, '—', '—', 'Active']]);
    setOpen(false); setNewVal('');
  };

  return (
    <div className={s.page}>
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Enquiry & Leads</h1>
          <p className={s.pageDesc}>Track student enquiries and convert them to admissions.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={15} /> Add Record</Button>
      </div>

      <div className={s.card}>
        <div className={s.tableControls}>
          <div className={s.searchWrap}>
            <Search size={14} className={s.searchIcon} />
            <input className={s.searchInput} type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Course Interest</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td><span className={s.mono}>{row[0]}</span></td>
                  <td><div className={s.nameCell}><div className={s.nameAvatar}>{String(row[1]).charAt(0)}</div>{row[1]}</div></td>
                  {row.slice(2, -1).map((c, j) => <td key={j}>{c}</td>)}
                  <td><span className={`${s.badge} ${row[row.length-1] === 'Active' ? s.badgeActive : s.badgeInactive}`}>{row[row.length-1]}</span></td>
                  <td><button className={s.iconBtn}><MoreVertical size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add New Record">
        <form onSubmit={handleAdd} className={s.form}>
          <Input label="Name" value={newVal} onChange={e => setNewVal(e.target.value)} required />
          <div className={s.formActions}>
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

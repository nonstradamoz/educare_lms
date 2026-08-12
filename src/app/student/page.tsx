'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, GraduationCap } from 'lucide-react';
import Modal from '@/components/UI/Modal/Modal';
import Input from '@/components/UI/Input/Input';
import Button from '@/components/UI/Button/Button';
import s from '@/styles/shared.module.css';

interface Student {
  id: string; name: string; course: string; batch: string; status: 'Active' | 'Inactive';
}

const MOCK: Student[] = [
  { id: 'STU-001', name: 'John Doe',       course: 'Full Stack Web Dev', batch: '2026-A', status: 'Active' },
  { id: 'STU-002', name: 'Jane Smith',      course: 'Data Science',       batch: '2026-B', status: 'Active' },
  { id: 'STU-003', name: 'Robert Johnson',  course: 'UI/UX Design',       batch: '2026-A', status: 'Inactive' },
];

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>(MOCK);
  const [search, setSearch]     = useState('');
  const [open, setOpen]         = useState(false);
  const [name, setName]         = useState('');
  const [course, setCourse]     = useState('');

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !course) return;
    setStudents([...students, { id: `STU-00${students.length + 1}`, name, course, batch: '2026-C', status: 'Active' }]);
    setOpen(false); setName(''); setCourse('');
  };

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.pageHeader}>
        <div>
          <h1 className={s.pageTitle}>Student Management</h1>
          <p className={s.pageDesc}>Manage enrolled students, update profiles, and track status.</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={15} /> Add Student</Button>
      </div>

      {/* Table Card */}
      <div className={s.card}>
        <div className={s.tableControls}>
          <div className={s.searchWrap}>
            <Search size={14} className={s.searchIcon} />
            <input
              className={s.searchInput}
              type="text"
              placeholder="Search students…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{filtered.length} student{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Course</th><th>Batch</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(st => (
                <tr key={st.id}>
                  <td><span className={s.mono}>{st.id}</span></td>
                  <td>
                    <div className={s.nameCell}>
                      <div className={s.nameAvatar}>{st.name.charAt(0)}</div>
                      {st.name}
                    </div>
                  </td>
                  <td>{st.course}</td>
                  <td>{st.batch}</td>
                  <td>
                    <span className={`${s.badge} ${st.status === 'Active' ? s.badgeActive : s.badgeInactive}`}>
                      {st.status}
                    </span>
                  </td>
                  <td>
                    <button className={s.iconBtn}><MoreVertical size={15} /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6}>
                    <div className={s.emptyState}>
                      <div className={s.emptyIcon}><GraduationCap size={22} /></div>
                      <p className={s.emptyTitle}>No students found</p>
                      <p className={s.emptyDesc}>Try a different search or add a new student.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add New Student">
        <form onSubmit={handleAdd} className={s.form}>
          <Input label="Full Name" placeholder="Enter student name" value={name} onChange={e => setName(e.target.value)} required />
          <Input label="Course"    placeholder="e.g. Data Science"  value={course} onChange={e => setCourse(e.target.value)} required />
          <div className={s.formActions}>
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save Student</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

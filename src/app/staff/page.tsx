'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical } from 'lucide-react';
import Button from '@/components/UI/Button/Button';
import Input from '@/components/UI/Input/Input';
import Modal from '@/components/UI/Modal/Modal';
import styles from '../student/page.module.css'; // Reusing student styles

export default function StaffUserManagementPage() {
  const [items, setItems] = useState([
    { id: '1', col1: 'Demo Staff 1', col2: 'Info A', col3: 'Info B', status: 'Active' },
    { id: '2', col1: 'Demo Staff 2', col2: 'Info C', col3: 'Info D', status: 'Inactive' },
  ]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [col1, setCol1] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!col1) return;
    setItems([...items, { id: Date.now().toString(), col1, col2: '-', col3: '-', status: 'Active' }]);
    setIsModalOpen(false);
    setCol1('');
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Staff & User Management</h1>
            <p className={styles.description}>Manage staff & user management records and details.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Add Staff
          </Button>
        </div>

        <div className={styles.card}>
          <div className={styles.tableControls}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search..." 
                className={styles.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th><th>Role</th><th>Department</th><th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td className={styles.fontMono}>#{item.id}</td>
                    <td className={styles.nameCell}>{item.col1}</td>
                    <td>{item.col2}</td>
                    <td>{item.col3}</td>
                    <td><span className={`${styles.statusBadge} ${item.status === 'Active' ? styles.active : styles.inactive}`}>{item.status}</span></td>
                    <td><button className={styles.actionBtn}><MoreVertical size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Staff">
        <form onSubmit={handleAdd} className={styles.form}>
          <Input 
            label="Name" 
            value={col1}
            onChange={(e) => setCol1(e.target.value)}
            required
          />
          <div className={styles.formActions}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

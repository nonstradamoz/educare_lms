'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, GraduationCap } from 'lucide-react';
import Button from '@/components/UI/Button/Button';
import Input from '@/components/UI/Input/Input';
import Modal from '@/components/UI/Modal/Modal';
import styles from './page.module.css';

interface Student {
  id: string;
  name: string;
  course: string;
  batch: string;
  status: 'Active' | 'Inactive';
}

const MOCK_STUDENTS: Student[] = [
  { id: 'STU-001', name: 'John Doe', course: 'Full Stack Web Dev', batch: '2026-A', status: 'Active' },
  { id: 'STU-002', name: 'Jane Smith', course: 'Data Science', batch: '2026-B', status: 'Active' },
  { id: 'STU-003', name: 'Robert Johnson', course: 'UI/UX Design', batch: '2026-A', status: 'Inactive' },
];

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New Student Form State
  const [newName, setNewName] = useState('');
  const [newCourse, setNewCourse] = useState('');

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCourse) return;
    
    const newStudent: Student = {
      id: `STU-00${students.length + 1}`,
      name: newName,
      course: newCourse,
      batch: '2026-C',
      status: 'Active'
    };
    
    setStudents([...students, newStudent]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewCourse('');
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Student Management</h1>
            <p className={styles.description}>Manage enrolled students, update profiles, and track status.</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Add Student
          </Button>
        </div>

        <div className={styles.card}>
          <div className={styles.tableControls}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search students..." 
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
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td className={styles.fontMono}>{student.id}</td>
                      <td className={styles.nameCell}>
                        <div className={styles.avatar}>
                          {student.name.charAt(0)}
                        </div>
                        {student.name}
                      </td>
                      <td>{student.course}</td>
                      <td>{student.batch}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[student.status.toLowerCase()]}`}>
                          {student.status}
                        </span>
                      </td>
                      <td>
                        <button className={styles.actionBtn}><MoreVertical size={16} /></button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      <GraduationCap size={32} className={styles.emptyIcon} />
                      <p>No students found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Student">
        <form onSubmit={handleAddStudent} className={styles.form}>
          <Input 
            label="Full Name" 
            placeholder="Enter student's full name" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Input 
            label="Course" 
            placeholder="e.g. Data Science" 
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            required
          />
          <div className={styles.formActions}>
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Student</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

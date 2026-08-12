'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import Header from '@/components/Header/Header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', transition: 'all 0.3s ease' }}>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <main 
        style={{ 
          flex: 1, 
          marginLeft: isSidebarOpen ? '250px' : '80px', 
          backgroundColor: 'var(--bg-color)',
          transition: 'margin-left 0.3s ease',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Header />
        <div className="page-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}

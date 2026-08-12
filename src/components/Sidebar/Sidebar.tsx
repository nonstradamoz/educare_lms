'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  Wrench, 
  Users, 
  UserPlus, 
  GraduationCap, 
  Video, 
  IndianRupee, 
  FileText, 
  BookOpen, 
  Award, 
  MessageSquare, 
  PieChart, 
  BarChart, 
  HelpCircle,
  Menu,
  ChevronLeft
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Settings', icon: Settings, href: '/settings' },
  { name: 'Setup', icon: Wrench, href: '/setup' },
  { name: 'Staff/User', icon: Users, href: '/staff' },
  { name: 'Enquiry/Leads', icon: UserPlus, href: '/leads' },
  { name: 'Student', icon: GraduationCap, href: '/student' },
  { name: 'Live Class', icon: Video, href: '/live-class' },
  { name: 'Fee', icon: IndianRupee, href: '/fee' },
  { name: 'Exam', icon: FileText, href: '/exam' },
  { name: 'eStudy', icon: BookOpen, href: '/estudy' },
  { name: 'Certificate', icon: Award, href: '/certificate' },
  { name: 'SMS', icon: MessageSquare, href: '/sms' },
  { name: 'Expense & Income', icon: PieChart, href: '/expense' },
  { name: 'Report', icon: BarChart, href: '/report' },
  { name: 'Help', icon: HelpCircle, href: '/help' },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
      <div className={styles.logoArea}>
        <div className={styles.logo}>{isOpen ? 'My Panel' : 'MP'}</div>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={index} className={styles.navItem} title={!isOpen ? item.name : undefined}>
                <Link href={item.href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
                  <Icon className={styles.icon} size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={styles.bottomControls}>
        <button className={styles.toggleBtn} onClick={onToggle} aria-label="Toggle Sidebar">
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </aside>
  );
}

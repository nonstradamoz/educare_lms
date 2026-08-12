'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Settings, Wrench, Users, UserPlus, GraduationCap,
  Video, IndianRupee, FileText, BookOpen, Award, MessageSquare,
  PieChart, BarChart, HelpCircle, ChevronLeft, Menu
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
      { name: 'Student',   icon: GraduationCap,  href: '/student' },
      { name: 'Live Class',icon: Video,           href: '/live-class' },
      { name: 'Fee',       icon: IndianRupee,     href: '/fee' },
      { name: 'Exam',      icon: FileText,        href: '/exam' },
      { name: 'eStudy',    icon: BookOpen,        href: '/estudy' },
      { name: 'Certificate',icon: Award,          href: '/certificate' },
    ],
  },
  {
    label: 'Management',
    items: [
      { name: 'Staff/User',     icon: Users,        href: '/staff' },
      { name: 'Enquiry/Leads',  icon: UserPlus,     href: '/leads' },
      { name: 'SMS',            icon: MessageSquare,href: '/sms' },
      { name: 'Expense & Income',icon: PieChart,    href: '/expense' },
      { name: 'Report',         icon: BarChart,     href: '/report' },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', icon: Settings, href: '/settings' },
      { name: 'Setup',    icon: Wrench,   href: '/setup' },
      { name: 'Help',     icon: HelpCircle, href: '/help' },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.brandIcon}>EC</div>
        <span className={styles.brandName}>EduCare</span>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className={styles.navLabel}>{section.label}</div>
            <ul className={styles.navList}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                return (
                  <li key={item.href} className={styles.navItem} title={!isOpen ? item.name : undefined}>
                    <Link href={item.href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
                      <Icon className={styles.navIcon} size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                      <span className={styles.navText}>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer toggle */}
      <div className={styles.footer}>
        <button className={styles.toggleBtn} onClick={onToggle} aria-label="Toggle Sidebar">
          {isOpen ? <><ChevronLeft size={16} /><span className={styles.navText}>Collapse</span></> : <Menu size={16} />}
        </button>
      </div>
    </aside>
  );
}

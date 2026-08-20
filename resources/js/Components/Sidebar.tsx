import { Link, usePage } from '@inertiajs/react';
import {
    ChartBarIcon,
    UsersIcon,
    UserGroupIcon,
    AcademicCapIcon,
    BookOpenIcon,
    CalendarIcon,
    ClipboardIcon,
    UserIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    CalendarDaysIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import type { ComponentType } from 'react';
import AppLogo from '@/Components/AppLogo';

interface NavItem {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

const adminLinks: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
    { name: 'Teachers', href: '/admin/teachers', icon: UsersIcon },
    { name: 'Students', href: '/admin/students', icon: UserGroupIcon },
    { name: 'Sections', href: '/admin/sections', icon: AcademicCapIcon },
    { name: 'Subjects', href: '/admin/subjects', icon: BookOpenIcon },
    { name: 'Timetable', href: '/timetable', icon: CalendarIcon },
    { name: 'Leaves', href: '/admin/leaves', icon: CalendarDaysIcon },
];

const studentLinks: NavItem[] = [
  { name: 'Dashboard', href: '/student/dashboard', icon: ChartBarIcon },
  { name: 'Timetable', href: '/student/timetable', icon: CalendarIcon },
  { name: 'My Marks', href: '/student/marks', icon: ChartBarIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
];

interface Props {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  onToggleCollapse: () => void;
}

export default function Sidebar({ collapsed, mobileOpen, onToggleMobile, onToggleCollapse }: Props) {
  const { url, props } = usePage();
  const user = (props.auth as any)?.user;
  const role = user?.role || 'teacher';

  const teacherLinks: NavItem[] = [
    { name: 'Dashboard', href: '/teacher/dashboard', icon: ChartBarIcon },
    ...(user?.teacher?.is_section_head
      ? [{ name: 'Timetable', href: '/timetable', icon: CalendarIcon }]
      : []),
    { name: 'My Timetable', href: '/teacher/timetable', icon: CalendarIcon },
    ...(user?.teacher?.is_section_head
      ? [{ name: 'Leave Approvals', href: '/teacher/section-leaves', icon: ClipboardIcon }]
      : []),
    { name: 'Mark Entry', href: '/teacher/mark-entry', icon: ClipboardIcon },
    { name: 'My Leaves', href: '/teacher/leaves', icon: CalendarDaysIcon},
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const links = role === 'admin' ? adminLinks : role === 'teacher' ? teacherLinks : studentLinks;

  const isActive = (href: string) => href !== '#' && url.startsWith(href);

  const sidebarContent = (isCollapsed: boolean) => (
    <div className="flex h-full flex-col bg-darkred text-white">
      {/* Logo at top */}
      <div className="flex h-20 items-center justify-center border-b border-white/10 px-4">
        <AppLogo compact={isCollapsed} textClassName="text-white" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={link.name}>
              <Link
                href={link.href}
                onClick={onToggleMobile}
                className={`group flex items-center rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive(link.href)
                    ? 'border-gold/80 bg-gold text-darkred shadow-sm'
                    : 'border-white/10 bg-white/[0.03] text-white/85 hover:border-white/25 hover:bg-white/10 hover:text-white'
                }`}
                title={isCollapsed ? link.name : undefined}
              >
                <link.icon className={`h-5 w-5 shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && <span className="truncate">{link.name}</span>}
              </Link>
              {index < links.length - 1 && <div className="mx-4 mt-2 border-t border-white/10" />}
            </div>
          ))}
        </div>
      </nav>

      {/* Toggle button at bottom */}
      <div className="border-t border-white/10 p-3">
        {/* <button
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center rounded-lg border border-white/10 p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
            <span className="flex items-center gap-0">
                {isCollapsed ? (
                <>
                    <ChevronDoubleRightIcon className="h-5 w-5" />
                    <ChevronDoubleRightIcon className="h-5 w-5 -ml-1" />
                </>
                ) : (
                <>
                    <ChevronDoubleLeftIcon className="h-5 w-5" />
                    <ChevronDoubleLeftIcon className="h-5 w-5 -ml-1" />
                </>
                )}
            </span>
        </button> */}
        
        <button
  onClick={onToggleCollapse}
  className="flex w-full items-center justify-center rounded-lg border border-white/10 p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
  aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
  title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
>
  <span className="relative flex items-center">
    {isCollapsed ? (
      <>
        <ChevronDoubleRightIcon className="h-5 w-5" />
        <ChevronDoubleRightIcon className="h-5 w-5 -ml-2.5" />
      </>
    ) : (
      <>
        <ChevronDoubleLeftIcon className="h-5 w-5" />
        <ChevronDoubleLeftIcon className="h-5 w-5 -ml-2.5" />
      </>
    )}
  </span>
</button>
      </div>
    </div>
  );

  return (
    <>
      <div className={`fixed inset-0 z-40 transition-opacity lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="fixed inset-0 bg-slate-950/60" onClick={onToggleMobile} />
        <div className="relative h-full w-72 max-w-xs bg-darkred shadow-2xl">
          {sidebarContent(false)}
        </div>
      </div>

      <aside
        className="hidden flex-shrink-0 transition-all duration-300 lg:block"
        style={{ width: collapsed ? '5rem' : '16rem' }}
      >
        {sidebarContent(collapsed)}
      </aside>
    </>
  );
}
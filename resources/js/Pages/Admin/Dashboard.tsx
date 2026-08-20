import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import {
  UsersIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClipboardIcon,
  ClockIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Props {
  stats: {
    teachers: number;
    students: number;
    sections: number;
    subjects: number;
    leaves: number;
  };
  recentActivity: {
    id: number;
    teacher: string;
    type: string;
    status: string;
    created_at: string;
  }[];
  leaveRequests: {
    id: number;
    teacher: string;
    type: string;
    status: string;
    created_at: string;
  }[];
}

export default function AdminDashboard({ stats, recentActivity, leaveRequests }: Props) {
  const widgets = [
    { label: 'Teachers', value: stats.teachers, icon: UsersIcon, accent: 'border-darkred', iconBg: 'bg-darkred/10 text-darkred' },
    { label: 'Students', value: stats.students, icon: UserGroupIcon, accent: 'border-gold', iconBg: 'bg-gold/10 text-amber-500' },
    { label: 'Sections', value: stats.sections, icon: AcademicCapIcon, accent: 'border-darkred', iconBg: 'bg-darkred/10 text-darkred' },
    { label: 'Subjects', value: stats.subjects, icon: BookOpenIcon, accent: 'border-gold', iconBg: 'bg-gold/10 text-amber-500' },
    { label: 'Leaves', value: stats.leaves, icon: ClipboardIcon, accent: 'border-darkred', iconBg: 'bg-darkred/10 text-darkred' },
  ];

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <Head title="Admin Dashboard" />
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor the main school records and jump into management tasks from one clean overview."
      />

      {/* Widgets */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {widgets.map((widget) => (
          <div key={widget.label} className={`panel border-t-4 ${widget.accent} p-5`}>
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${widget.iconBg}`}>
                <widget.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{widget.label}</p>
                <p className="text-2xl font-bold text-slate-950">{widget.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity, Leave Requests, Calendar */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="panel p-6">
          <div className="flex items-center gap-3">
            <ClockIcon className="h-5 w-5 text-darkred" />
            <h2 className="text-lg font-bold text-slate-950">Recent Activity</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">Latest system actions and updates.</p>
          <div className="mt-4 max-h-72 overflow-y-auto pr-1">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ClockIcon className="h-12 w-12 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">No recent activity yet.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="rounded-lg bg-slate-50 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900">{activity.teacher}</p>
                      <span className="text-xs text-slate-400">{activity.created_at}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{activity.type}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="panel p-6">
          <div className="flex items-center gap-3">
            <ClipboardIcon className="h-5 w-5 text-darkred" />
            <h2 className="text-lg font-bold text-slate-950">Leave Requests</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">Latest teacher leave requests.</p>
          <div className="mt-4 max-h-72 overflow-y-auto pr-1">
            {leaveRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <ClipboardIcon className="h-12 w-12 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">No leave requests yet.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {leaveRequests.map((leave) => (
                  <li key={leave.id} className="rounded-lg bg-slate-50 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            leave.status === 'admin_approved'
                              ? 'bg-green-100 text-green-800'
                              : leave.status === 'section_approved'
                              ? 'bg-blue-100 text-blue-800'
                              : leave.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {leave.status}
                        </span>
                        <p className="text-sm font-medium text-slate-900">{leave.teacher}</p>
                      </div>
                      <span className="text-xs text-slate-400">{leave.created_at}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{leave.type}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Calendar */}
        <div className="panel p-6">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-darkred" />
            <h2 className="text-lg font-bold text-slate-950">Calendar</h2>
          </div>
          <div className="mt-4">
            <Calendar />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

// Simple monthly calendar component
function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  // Sri Lankan public holidays for 2026 (approximate; can be extended)
  const holidays = [
    { month: 1, day: 15 }, // Thai Pongal
    { month: 2, day: 4 },  // National Day
    { month: 4, day: 13 }, // Sinhala & Tamil New Year (day prior)
    { month: 4, day: 14 }, // Sinhala & Tamil New Year
    { month: 5, day: 1 },  // May Day
    { month: 12, day: 25 }, // Christmas
  ];

  const isHoliday = (day: number) => {
    const date = new Date(year, month, day);
    const isSunday = date.getDay() === 0;
    const isPublicHoliday = holidays.some(
      (holiday) => holiday.month === month + 1 && holiday.day === day
    );
    return isSunday || isPublicHoliday;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div>
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">
          {monthName} {year}
        </p>
        <div className="flex gap-1">
          <button
            onClick={goToPreviousMonth}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
            title="Previous month"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
            title="Next month"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Day labels */}
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}

        {/* Blank cells for alignment */}
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} />
        ))}

        {/* Day cells */}
        {days.map((day) => {
          const holiday = isHoliday(day);
          return (
            <div
              key={day}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                isToday(day)
                  ? 'bg-darkred font-bold text-white'
                  : holiday
                  ? 'bg-red-50 text-red-600 font-medium'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title={holiday ? 'Holiday' : ''}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
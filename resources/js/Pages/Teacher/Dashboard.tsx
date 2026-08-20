import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import {
  BookOpenIcon,
  ClockIcon,
  CalendarIcon,
  ClipboardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Teacher {
  full_name: string;
  teacher_registration_number: string;
}

interface Props {
  teacher: Teacher | null;
  stats?: {
    subjects: number;
    classes_today: number;
    pending_leaves: number;
    total_slots: number;
  };
}

export default function TeacherDashboard({
  teacher,
  stats = { subjects: 0, classes_today: 0, pending_leaves: 0, total_slots: 0 },
}: Props) {
  const widgets = [
    {
      label: 'My Subjects',
      value: stats.subjects,
      icon: BookOpenIcon,
      gradient: 'from-darkred to-red-800',
      iconColor: 'bg-darkred/10 text-darkred',
    },
    {
      label: "Today's Classes",
      value: stats.classes_today,
      icon: ClockIcon,
      gradient: 'from-amber-500 to-gold',
      iconColor: 'bg-gold/10 text-amber-600',
    },
    {
      label: 'Pending Leaves',
      value: stats.pending_leaves,
      icon: ClipboardIcon,
      gradient: 'from-darkred to-red-800',
      iconColor: 'bg-darkred/10 text-darkred',
    },
    {
      label: 'Weekly Slots',
      value: stats.total_slots,
      icon: CalendarIcon,
      gradient: 'from-amber-500 to-gold',
      iconColor: 'bg-gold/10 text-amber-600',
    },
  ];

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <Head title="Teacher Dashboard" />
      <PageHeader
        title={`Welcome, ${teacher?.full_name ?? 'Teacher'}`}
        subtitle="View your teaching profile, timetable updates, and class tasks from this workspace."
      />

      {/* Widgets */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {widgets.map((widget) => (
          <div
            key={widget.label}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            {/* gradient top bar */}
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${widget.gradient}`} />
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${widget.iconColor}`}>
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

      {/* Calendar */}
      <div className="mt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-darkred/10 text-darkred">
              <CalendarIcon className="h-5 w-5" />
            </div>
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
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  // Sri Lankan public holidays (2026 example)
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

  const goToPreviousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">{monthName} {year}</p>
        <div className="flex gap-1">
          <button
            onClick={goToPreviousMonth}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
            title="Previous month"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
            title="Next month"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
        {[
          { short: 'Su', full: 'Sunday' },
          { short: 'Mo', full: 'Monday' },
          { short: 'Tu', full: 'Tuesday' },
          { short: 'We', full: 'Wednesday' },
          { short: 'Th', full: 'Thursday' },
          { short: 'Fr', full: 'Friday' },
          { short: 'Sa', full: 'Saturday' },
        ].map((d) => (
          <div key={d.short} className="py-1">
            <span className="md:hidden">{d.short}</span>
            <span className="hidden md:inline">{d.full}</span>
          </div>
        ))}
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} />
        ))}
        {days.map((day) => {
          const holiday = isHoliday(day);
          return (
            <div
              key={day}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
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
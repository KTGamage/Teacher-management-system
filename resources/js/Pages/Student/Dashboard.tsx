import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import {
  BookOpenIcon,
  ClockIcon,
  ChartBarIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Student {
  full_name: string;
  registration_number: string;
  section?: { name: string } | null;
}

interface Props {
  student: Student | null;
  stats?: {
    subjects: number;
    classes_today: number;
    marks_entries: number;
    upcoming_exams: number;
  };
}

export default function StudentDashboard({
  student,
  stats = { subjects: 0, classes_today: 0, marks_entries: 0, upcoming_exams: 0 },
}: Props) {
  const widgets = [
    {
      label: 'My Subjects',
      value: stats.subjects,
      icon: BookOpenIcon,
      accent: 'border-darkred',
      iconBg: 'bg-darkred/10 text-darkred',
    },
    {
      label: "Today's Classes",
      value: stats.classes_today,
      icon: ClockIcon,
      accent: 'border-gold',
      iconBg: 'bg-gold/10 text-amber-500',
    },
    {
      label: 'Marks Entries',
      value: stats.marks_entries,
      icon: ChartBarIcon,
      accent: 'border-darkred',
      iconBg: 'bg-darkred/10 text-darkred',
    },
    {
      label: 'Upcoming Exams',
      value: stats.upcoming_exams,
      icon: CalendarIcon,
      accent: 'border-gold',
      iconBg: 'bg-gold/10 text-amber-500',
    },
  ];

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Dashboard' }]}>
      <Head title="Student Dashboard" />
      <PageHeader
        title={`Welcome, ${student?.full_name ?? 'Student'}`}
        subtitle="Keep track of your class details, marks, and school information from one place."
      />

      {/* Widgets */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Calendar */}
      <div className="mt-8">
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

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div>
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

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} />
        ))}
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
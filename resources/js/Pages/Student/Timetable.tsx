import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

interface Slot {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  section_subject: {
    subject: { name: string; code?: string };
  };
  teacher: { full_name: string };
}

interface Props {
  slots: Slot[];
  days?: string[];
}

export default function StudentTimetable({ slots, days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] }: Props) {
  const groupedSlots = days.reduce((acc, day) => {
    acc[day] = slots.filter((slot) => slot.day_of_week === day);
    return acc;
  }, {} as Record<string, Slot[]>);

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'My Timetable' }]}>
      <Head title="Timetable" />
      <PageHeader
        title="Class Timetable"
        subtitle="Your weekly schedule at a glance."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {days.map((day) => (
          <div key={day} className="panel overflow-hidden">
            {/* Day header */}
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </h3>
            </div>

            {/* Slots */}
            <div className="divide-y divide-slate-100">
              {groupedSlots[day]?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CalendarIcon className="h-10 w-10 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">No classes</p>
                </div>
              ) : (
                groupedSlots[day].map((slot) => (
                  <div key={slot.id} className="px-5 py-4 hover:bg-slate-50 transition">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-darkred/10 text-darkred">
                        <BookOpenIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 truncate">
                          {slot.section_subject?.subject?.name}
                        </p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <ClockIcon className="h-4 w-4 shrink-0" />
                            <span>
                              {slot.start_time} – {slot.end_time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <UserIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{slot.teacher?.full_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
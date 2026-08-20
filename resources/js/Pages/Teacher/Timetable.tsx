import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import TimetableGrid from '@/Components/TimetableGrid';

export default function MyTimetable({ slots }: { slots: any[] }) {
  // We'll reuse the grid but with a different data source.
  // Since the teacher view uses the teacher's slots directly, we can pass them.
  // For simplicity, we'll just render a grid from slots.
  // But our TimetableGrid expects a sectionId. Let's create a different display.

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'My Timetable' }]}>
      <Head title="My Timetable" />
      <PageHeader title="My Timetable" subtitle="Your weekly schedule." />
      <div className="panel p-4">
        {/* A simple list view by day */}
        {['monday','tuesday','wednesday','thursday','friday'].map(day => {
          const daySlots = slots.filter(s => s.day_of_week === day);
          return (
            <div key={day} className="mb-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">{day}</h3>
              <div className="space-y-2">
                {daySlots.map(slot => (
                  <div key={slot.id} className="flex justify-between bg-slate-50 p-3 rounded-lg">
                    <div>
                      <span className="font-medium">{slot.section_subject?.subject?.name}</span>
                      <span className="text-xs text-slate-400 ml-2">({slot.section_subject?.section?.name})</span>
                    </div>
                    <span className="text-sm text-slate-500">{slot.start_time} - {slot.end_time}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AuthenticatedLayout>
  );
}
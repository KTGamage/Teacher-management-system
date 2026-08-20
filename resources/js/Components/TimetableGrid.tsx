import { useEffect, useState } from 'react';
import axios from 'axios';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Slot {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  section_subject: { subject: { name: string; code: string } };
  teacher: { full_name: string };
}

interface Props {
  sectionId?: number;
  viewOnly?: boolean;
  canManage?: boolean;
}

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export default function TimetableGrid({ sectionId, viewOnly = false, canManage = false }: Props) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sectionId) return;
    setLoading(true);
    axios.get(`/timetable/${sectionId}`)
      .then(res => setSlots(res.data))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [sectionId]);

  const grouped: Record<string, Slot[]> = {};
  days.forEach(d => grouped[d] = slots.filter(s => s.day_of_week === d));

  const timeToRow = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m; // minutes from midnight
  };

  const minTime = Math.min(...slots.map(s => timeToRow(s.start_time)), 480); // 8:00
  const maxTime = Math.max(...slots.map(s => timeToRow(s.end_time)), 1020); // 17:00

  const renderSlot = (slot: Slot) => {
    const top = (timeToRow(slot.start_time) - minTime) / (maxTime - minTime) * 100;
    const height = (timeToRow(slot.end_time) - timeToRow(slot.start_time)) / (maxTime - minTime) * 100;
    return (
      <div
        key={slot.id}
        className="absolute left-1 right-1 bg-darkred text-white rounded-lg px-2 py-1 text-xs flex flex-col justify-center"
        style={{ top: `${top}%`, height: `${height}%` }}
      >
        <span className="font-semibold">{slot.section_subject.subject.name}</span>
        <span className="text-white/80">{slot.teacher.full_name}</span>
        <span className="text-white/60">{slot.start_time} - {slot.end_time}</span>
        {canManage && (
          <button
            onClick={() => {
              if (confirm('Remove this slot?')) {
                axios.delete(`/timetable/${slot.id}`)
                  .then(() => setSlots(slots.filter(s => s.id !== slot.id)))
                  .catch(() => alert('Error'));
              }
            }}
            className="absolute top-1 right-1 text-white/70 hover:text-white"
          >
            <TrashIcon className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  };

  if (loading) return <p className="text-sm text-slate-500">Loading timetable...</p>;

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-5 gap-0 min-w-[600px]">
        {days.map(day => (
          <div key={day} className="border-r border-slate-200 last:border-0">
            <div className="bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase text-slate-500">
              {day}
            </div>
            <div className="relative" style={{ height: '400px' }}>
              {grouped[day]?.map(slot => renderSlot(slot))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import toast from 'react-hot-toast';
import axios from 'axios';
import {
  TrashIcon,
  PlusIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ConfirmDialog from '@/Components/ConfirmDialog';

interface Section {
  id: number;
  name: string;
  code: string;
  class_name?: string | null;
  classes: { id: number; name: string }[];
}

interface Slot {
  id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  section_subject: {
    id: number;
    subject: { name: string; code: string };
  };
  teacher: { id: number; full_name: string };
  class_room_id: number;
}

interface Props {
  sections: Section[];
}

export default function TimetableIndex({ sections }: Props) {
  const [selectedSection, setSelectedSection] = useState<number | null>(sections[0]?.id || null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [sectionSubjects, setSectionSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [days] = useState(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);

  // Drag state
  const [draggedSlot, setDraggedSlot] = useState<Slot | null>(null);

  // Edit modal state
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Delete confirmation state
  const [slotToDelete, setSlotToDelete] = useState<Slot | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Form for creating a new slot (existing)
  const { data, setData, post, processing, errors } = useForm({
    section_subject_id: '',
    day_of_week: 'monday',
    start_time: '08:00',
    end_time: '09:00',
    teacher_id: '',
    class_room_id: '',
  });

  // Form for editing a slot (separate)
  const {
    data: editData,
    setData: setEditData,
    put,
    processing: editProcessing,
    errors: editErrors,
  } = useForm({
    section_subject_id: '',
    day_of_week: 'monday',
    start_time: '',
    end_time: '',
    teacher_id: '',
    class_room_id: '',
  });

  // Load section subjects and classes when selectedSection changes
  useEffect(() => {
    if (!selectedSection) return;
    axios
      .get(`/timetable/${selectedSection}/section-subjects`)
      .then((res) => {
        setSectionSubjects(res.data.section_subjects);
        setTeachers(res.data.teachers);
        setClasses(res.data.classes || []);
        setSelectedClass(null);
        setSlots([]);
      })
      .catch(() => {
        setSectionSubjects([]);
        setTeachers([]);
        setClasses([]);
      });
  }, [selectedSection]);

  // Load slots when class changes
  useEffect(() => {
    if (!selectedSection || !selectedClass) return;
    axios
      .get(`/timetable/${selectedSection}?class_room_id=${selectedClass}`)
      .then((res) => setSlots(res.data))
      .catch(() => setSlots([]));
  }, [selectedSection, selectedClass]);

  // --- Drag handlers ---
  const handleDragStart = (e: React.DragEvent, slot: Slot) => {
    setDraggedSlot(slot);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', slot.id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

 const handleDrop = async (e: React.DragEvent, targetDay: string) => {
  e.preventDefault();
  if (!draggedSlot || !selectedClass) return;

  const newSlot = {
    section_subject_id: draggedSlot.section_subject.id,
    teacher_id: draggedSlot.teacher.id,
    class_room_id: selectedClass,
    day_of_week: targetDay,
    start_time: draggedSlot.start_time,
    end_time: draggedSlot.end_time,
  };

  try {
    await axios.post('/timetable', newSlot);
    const res = await axios.get(
      `/timetable/${selectedSection}?class_room_id=${selectedClass}`
    );
    setSlots(res.data);
    toast.success('Slot copied to ' + targetDay);
  } catch (error: any) {
    if (error.response?.status === 422) {
      toast.error(error.response.data.message || 'Conflict detected.');
    } else {
      toast.error('Could not copy slot. Please try again.');
    }
  } finally {
    setDraggedSlot(null);
  }
};

  // --- Delete handler with custom dialog ---
  const handleDeleteRequest = (slot: Slot) => {
    if (!slot.id) {
        toast.error('Slot ID is missing.');
        return;
    }
    setSlotToDelete(slot);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
  if (!slotToDelete || !slotToDelete.id) {
    toast.error('Slot ID is missing.');
    return;
  }

  router.delete(`/timetable/${slotToDelete.id}`, {
    onSuccess: () => {
      setSlots(slots.filter((s) => s.id !== slotToDelete.id));
      toast.success('Slot deleted.');
      setConfirmOpen(false);
      setSlotToDelete(null);
    },
    onError: () => {
      toast.error('Delete failed.');
      setConfirmOpen(false);
      setSlotToDelete(null);
    },
  });
};

  // --- Edit handlers ---
  const openEditModal = (slot: Slot) => {
    setEditingSlot(slot);
    setEditData({
      section_subject_id: slot.section_subject.id.toString(),
      day_of_week: slot.day_of_week,
      start_time: slot.start_time,
      end_time: slot.end_time,
      teacher_id: slot.teacher.id.toString(),
      class_room_id: slot.class_room_id.toString(),
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;

    put(`/timetable/${editingSlot.id}`, {
      onSuccess: () => {
        toast.success('Slot updated.');
        setShowEditModal(false);
        setEditingSlot(null);
        if (selectedSection && selectedClass) {
          axios
            .get(`/timetable/${selectedSection}?class_room_id=${selectedClass}`)
            .then((res) => setSlots(res.data));
        }
      },
      onError: () => toast.error('Update failed. Check conflicts.'),
    });
  };

  // Group slots by day
  const groupedSlots = days.reduce((acc, day) => {
    acc[day] = slots.filter((s) => s.day_of_week === day);
    return acc;
  }, {} as Record<string, Slot[]>);

  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Timetable' }]}>
      <Head title="Timetable Management" />
      <PageHeader
        title="Timetable Management"
        subtitle="Create, edit, and drag‑and‑drop time slots between days."
      />

      {/* Section / Class selectors */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Select Section</label>
          <select
            value={selectedSection ?? ''}
            onChange={(e) => setSelectedSection(Number(e.target.value))}
            className="field-input"
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Select Class</label>
          <select
            value={selectedClass ?? ''}
            onChange={(e) => setSelectedClass(Number(e.target.value))}
            className="field-input"
            disabled={!selectedSection}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slot creation form */}
        <div className="panel p-6 lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-950 mb-4">Add New Slot</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedClass) {
                toast.error('Please select a class first.');
                return;
              }
              setData('class_room_id', selectedClass.toString());
              post('/timetable', {
                onSuccess: () => {
                  toast.success('Slot added.');
                  axios
                    .get(`/timetable/${selectedSection}?class_room_id=${selectedClass}`)
                    .then((res) => setSlots(res.data));
                },
                onError: () => toast.error('Failed to add slot.'),
              });
            }}
            className="space-y-5"
          >
            <div>
              <label className="field-label">Day</label>
              <select
                value={data.day_of_week}
                onChange={(e) => setData('day_of_week', e.target.value)}
                className="field-input"
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Subject</label>
              <select
                value={data.section_subject_id}
                onChange={(e) => {
                  setData('section_subject_id', e.target.value);
                  const ss = sectionSubjects.find(
                    (s) => s.id.toString() === e.target.value
                  );
                  if (ss?.teacher_id) {
                    setData('teacher_id', ss.teacher_id.toString());
                  }
                }}
                className="field-input"
                required
              >
                <option value="">Select Subject</option>
                {sectionSubjects.map((ss) => (
                  <option key={ss.id} value={ss.id}>
                    {ss.subject.name} ({ss.subject.code})
                  </option>
                ))}
              </select>
              {errors.section_subject_id && (
                <div className="field-error">{errors.section_subject_id}</div>
              )}
            </div>
            <div>
              <label className="field-label">Teacher</label>
              <select
                value={data.teacher_id}
                onChange={(e) => setData('teacher_id', e.target.value)}
                className="field-input"
                required
              >
                <option value="">Select Teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Start Time</label>
                <input
                  type="time"
                  value={data.start_time}
                  onChange={(e) => setData('start_time', e.target.value)}
                  className="field-input"
                  required
                />
              </div>
              <div>
                <label className="field-label">End Time</label>
                <input
                  type="time"
                  value={data.end_time}
                  onChange={(e) => setData('end_time', e.target.value)}
                  className="field-input"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={processing} className="primary-button">
                <PlusIcon className="mr-2 h-5 w-5" /> Add Slot
              </button>
            </div>
          </form>
        </div>

        {/* Weekly schedule grid */}
        <div className="panel p-6 lg:col-span-2 overflow-x-auto">
          <h2 className="text-lg font-bold text-slate-950 mb-4">Weekly Schedule</h2>
          <div className="min-w-[600px]">
            <div className="grid grid-cols-5 gap-0">
              {days.map((day) => (
                <div
                  key={day}
                  className="border-r border-slate-200 last:border-0"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day)}
                >
                  <div className="bg-slate-50 px-3 py-2 text-center text-xs font-semibold uppercase text-slate-500">
                    {day}
                  </div>
                  <div className="relative h-96 overflow-y-auto p-1">
                    {groupedSlots[day]?.map((slot) => (
                      <div
                        key={slot.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, slot)}
                        className="mb-2 cursor-grab rounded-lg bg-darkred p-2 text-white shadow-sm transition hover:shadow-md active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold">
                              {slot.section_subject?.subject?.name}
                            </p>
                            <p className="text-xs text-white/80">
                              {slot.teacher?.full_name}
                            </p>
                            <p className="text-xs text-white/60">
                              {slot.start_time} - {slot.end_time}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => openEditModal(slot)}
                              className="text-white/70 hover:text-white"
                              title="Edit slot"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRequest(slot)}
                              className="text-white/70 hover:text-white"
                              title="Delete slot"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {groupedSlots[day]?.length === 0 && (
                      <p className="py-4 text-center text-xs text-slate-400">
                        No slots
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-950">Edit Slot</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div>
                <label className="field-label">Subject</label>
                <select
                  value={editData.section_subject_id}
                  onChange={(e) =>
                    setEditData('section_subject_id', e.target.value)
                  }
                  className="field-input"
                  required
                >
                  <option value="">Select Subject</option>
                  {sectionSubjects.map((ss) => (
                    <option key={ss.id} value={ss.id}>
                      {ss.subject.name} ({ss.subject.code})
                    </option>
                  ))}
                </select>
                {editErrors.section_subject_id && (
                  <div className="field-error">{editErrors.section_subject_id}</div>
                )}
              </div>

              <div>
                <label className="field-label">Teacher</label>
                <select
                  value={editData.teacher_id}
                  onChange={(e) => setEditData('teacher_id', e.target.value)}
                  className="field-input"
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Day</label>
                  <select
                    value={editData.day_of_week}
                    onChange={(e) => setEditData('day_of_week', e.target.value)}
                    className="field-input"
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label">Class</label>
                  <select
                    value={editData.class_room_id}
                    onChange={(e) => setEditData('class_room_id', e.target.value)}
                    className="field-input"
                    disabled
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Start Time</label>
                  <input
                    type="time"
                    value={editData.start_time}
                    onChange={(e) => setEditData('start_time', e.target.value)}
                    className="field-input"
                    required
                  />
                </div>
                <div>
                  <label className="field-label">End Time</label>
                  <input
                    type="time"
                    value={editData.end_time}
                    onChange={(e) => setEditData('end_time', e.target.value)}
                    className="field-input"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editProcessing}
                  className="primary-button"
                >
                  Update Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Slot"
        message="Are you sure you want to delete this timetable slot?"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={false}
      />
    </AuthenticatedLayout>
  );
}
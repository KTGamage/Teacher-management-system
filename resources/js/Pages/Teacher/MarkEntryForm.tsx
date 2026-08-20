import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import PageHeader from '@/Components/PageHeader';

interface Student {
  id: number;
  full_name: string;
  registration_number: string;
}

interface SectionSubject {
  id: number;
  subject: { name: string; code: string };
  section: { name: string; code: string };
}

interface Props {
  sectionSubject: SectionSubject;
  students: Student[];
  existingMarks: Record<number, { marks: number; remarks?: string }>;
  examType: string;
  examDate: string;
}

export default function MarkEntryForm({ sectionSubject, students, existingMarks, examType, examDate }: Props) {
  const initialMarks = students.map((student) => ({
    student_id: student.id,
    marks: existingMarks[student.id]?.marks ?? '',
    remarks: existingMarks[student.id]?.remarks ?? '',
  }));

  const { data, setData, post, processing, errors } = useForm({
    section_subject_id: sectionSubject.id,
    exam_type: examType,
    exam_date: examDate,
    marks: initialMarks,
  });

  const handleMarksChange = (index: number, field: 'marks' | 'remarks', value: string) => {
    const updated = data.marks.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    setData('marks', updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/teacher/marks', {
      onSuccess: () => toast.success('Marks saved.'),
      onError: () => toast.error('Error saving marks.'),
    });
  };

  return (
    <AuthenticatedLayout breadcrumbs={[
      { label: 'Mark Entry', url: '/teacher/mark-entry' },
      { label: `${sectionSubject.subject.name} (${sectionSubject.section.name})` }
    ]}>
      <Head title="Enter Marks" />
      <PageHeader
        title={`Enter Marks - ${sectionSubject.subject.name}`}
        subtitle={`Section: ${sectionSubject.section.name} | Exam: ${examType} | Date: ${examDate}`}
      />
      <form onSubmit={handleSubmit} className="panel max-w-3xl mx-auto space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Exam Type</label>
            <select
              value={data.exam_type}
              onChange={e => setData('exam_type', e.target.value)}
              className="field-input"
            >
              <option value="class_test">Class Test</option>
              <option value="mid_term">Mid Term</option>
              <option value="final_exam">Final Exam</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>
          <div>
            <label className="field-label">Exam Date</label>
            <input
              type="date"
              value={data.exam_date}
              onChange={e => setData('exam_date', e.target.value)}
              className="field-input"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-500">Student</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-500">Marks (0-100)</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-500">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td className="px-4 py-2 text-sm">
                    <p className="font-medium">{student.full_name}</p>
                    <p className="text-xs text-slate-400">{student.registration_number}</p>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={data.marks[index]?.marks}
                      onChange={e => handleMarksChange(index, 'marks', e.target.value)}
                      className="field-input"
                      required
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={data.marks[index]?.remarks}
                      onChange={e => handleMarksChange(index, 'remarks', e.target.value)}
                      className="field-input"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-5">
          <button type="submit" disabled={processing} className="primary-button">
            Save Marks
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
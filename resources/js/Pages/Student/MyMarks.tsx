import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import {
  BookOpenIcon,
  AcademicCapIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';

interface Mark {
  id: number;
  exam_type: string;
  exam_date: string;
  marks: number;
  remarks?: string | null;
  section_subject: {
    subject: {
      name: string;
      code?: string;
    };
  };
}

interface MarksGroup {
  [sectionSubjectId: number]: Mark[];
}

interface Props {
  student: {
    id: number;
    full_name: string;
    registration_number: string;
  };
  marks: MarksGroup;
}

export default function MyMarks({ student, marks }: Props) {
  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'My Marks' }]}>
      <Head title="My Marks" />
      <PageHeader
        title="My Marks"
        subtitle="View your exam and assignment results."
        actions={
          <a
            href={`/student/marks/pdf`}
            className="secondary-button"
          >
            <DocumentArrowDownIcon className="mr-2 h-5 w-5" />
            Download PDF
          </a>
        }
      />

      <div className="space-y-6">
        {Object.entries(marks).map(([id, markList]: [string, Mark[]]) => {
          const first = markList[0];
          const subjectName = first?.section_subject?.subject?.name || 'Unknown Subject';
          const subjectCode = first?.section_subject?.subject?.code || '';
          const average =
            markList.reduce((sum, mark) => sum + Number(mark.marks), 0) /
            markList.length;

          return (
            <div key={id} className="panel overflow-hidden">
              {/* Subject header */}
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-darkred/10 text-darkred">
                    <BookOpenIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">
                      {subjectName}
                      {subjectCode && (
                        <span className="ml-2 text-xs font-medium text-slate-400">
                          {subjectCode}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {markList.length} record{markList.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Average</p>
                  <p className={`text-2xl font-bold ${
                    average >= 75 ? 'text-green-600' :
                    average >= 50 ? 'text-amber-500' :
                    'text-red-600'
                  }`}>
                    {average.toFixed(1)}
                  </p>
                </div>
              </div>

              {/* Marks table */}
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Exam Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {markList.map((mark) => (
                    <tr key={mark.id} className="transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-700">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                          {mark.exam_type}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-500">
                        {mark.exam_date}
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-sm font-semibold">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          Number(mark.marks) >= 75
                            ? 'bg-green-100 text-green-800'
                            : Number(mark.marks) >= 50
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {mark.marks}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-500">
                        {mark.remarks || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </AuthenticatedLayout>
  );
}
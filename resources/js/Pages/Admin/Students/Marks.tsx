import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import {
  DocumentArrowDownIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

interface Props {
  student: {
    id: any;
    full_name: string;
    registration_number: string;
  };
  marks: Record<string, any[]> | null;
}

export default function StudentMarks({ student, marks }: Props) {
  const hasMarks = marks && Object.keys(marks).length > 0;

  // Calculate overall average if marks exist
  const allMarks = hasMarks ? Object.values(marks).flat() : [];
  const overallAverage =
    allMarks.length > 0
      ? allMarks.reduce((sum, mark) => sum + Number(mark.marks), 0) / allMarks.length
      : 0;

  return (
    <AuthenticatedLayout
      breadcrumbs={[
        { label: 'Students', url: '/admin/students' },
        { label: student.full_name },
      ]}
    >
      <Head title={`Marks - ${student.full_name}`} />
      <PageHeader
        title={`Marks for ${student.full_name}`}
        subtitle={`Registration: ${student.registration_number}`}
        actions={
          <a
            href={`/admin/students/${student.id}/marks/pdf`}
            className="secondary-button"
          >
            <DocumentArrowDownIcon className="mr-2 h-5 w-5" />
            Download PDF
          </a>
        }
      />

      {/* Summary Cards */}
      {hasMarks && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="panel p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-darkred/10 text-darkred">
                <BookOpenIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Subjects</p>
                <p className="text-2xl font-bold text-slate-950">{Object.keys(marks).length}</p>
              </div>
            </div>
          </div>
          <div className="panel p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-amber-500">
                <ClipboardDocumentListIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Total Entries</p>
                <p className="text-2xl font-bold text-slate-950">{allMarks.length}</p>
              </div>
            </div>
          </div>
          <div className="panel p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-darkred/10 text-darkred">
                <AcademicCapIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Average</p>
                <p className={`text-2xl font-bold ${
                  overallAverage >= 75 ? 'text-green-600' :
                  overallAverage >= 50 ? 'text-amber-500' : 'text-red-600'
                }`}>
                  {overallAverage.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Marks Content */}
      <div className="mt-6">
        {!hasMarks ? (
          <div className="panel flex flex-col items-center justify-center py-16 text-center">
            <BookOpenIcon className="h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700">No marks available</h3>
            <p className="mt-1 text-sm text-slate-500">
              This student has not received any marks yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(marks).map(([id, markList]) => {
              const first = markList[0];
              const subjectName = first?.section_subject?.subject?.name || 'Unknown Subject';
              const subjectCode = first?.section_subject?.subject?.code || '';
              const subjectAverage =
                markList.reduce((sum, mark) => sum + Number(mark.marks), 0) / markList.length;

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
                        subjectAverage >= 75 ? 'text-green-600' :
                        subjectAverage >= 50 ? 'text-amber-500' :
                        'text-red-600'
                      }`}>
                        {subjectAverage.toFixed(1)}
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
                      {markList.map((mark: any) => (
                        <tr key={mark.id} className="transition hover:bg-slate-50">
                          <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-700">
                            <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                              {mark.exam_type}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-sm text-slate-500">
                            {mark.exam_date}
                          </td>
                          <td className="whitespace-nowrap px-6 py-3">
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
        )}
      </div>
    </AuthenticatedLayout>
  );
}
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import { DocumentArrowDownIcon, BookOpenIcon } from '@heroicons/react/24/outline';

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
      />

      <div className="panel p-6">
        <a
          href={`/admin/students/${student.id}/marks/pdf`}
          className="mb-4 inline-flex items-center gap-2 text-darkred hover:text-red-800"
        >
          <DocumentArrowDownIcon className="h-5 w-5" /> Download PDF
        </a>

        {!hasMarks ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpenIcon className="h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700">No marks available</h3>
            <p className="mt-1 text-sm text-slate-500">
              This student has not received any marks yet.
            </p>
          </div>
        ) : (
          <>
            {Object.entries(marks).map(([id, markList]) => {
              const first = markList[0];
              const subjectName = first?.section_subject?.subject?.name || 'Unknown Subject';

              return (
                <div key={id} className="mb-6">
                  <h3 className="text-lg font-bold text-slate-950">{subjectName}</h3>
                  <table className="mt-2 min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Exam Type</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Marks</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {markList.map((mark: any) => (
                        <tr key={mark.id}>
                          <td className="px-4 py-2 text-sm text-slate-700">{mark.exam_type}</td>
                          <td className="px-4 py-2 text-sm text-slate-500">{mark.exam_date}</td>
                          <td className="px-4 py-2 text-sm font-semibold text-slate-900">{mark.marks}</td>
                          <td className="px-4 py-2 text-sm text-slate-500">{mark.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
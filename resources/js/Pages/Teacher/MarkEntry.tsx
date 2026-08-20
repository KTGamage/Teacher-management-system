import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import {
  ClipboardIcon,
  PencilSquareIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';

interface SectionSubject {
  id: number;
  subject: { name: string; code: string };
  section: { name: string; code: string };
}

interface Props {
  sectionSubjects: SectionSubject[];
}

export default function MarkEntry({ sectionSubjects }: Props) {
  return (
    <AuthenticatedLayout breadcrumbs={[{ label: 'Mark Entry' }]}>
      <Head title="Mark Entry" />
      <PageHeader
        title="Mark Entry"
        subtitle="Select a subject and section to enter or update student marks."
      />

      <div className="panel overflow-hidden">
        {sectionSubjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardIcon className="h-16 w-16 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-700">No assigned subjects</h3>
            <p className="mt-1 text-sm text-slate-500">You are not assigned to any subject yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {sectionSubjects.map((ss) => (
              <li
                key={ss.id}
                className="flex flex-col gap-3 px-6 py-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {ss.subject.name}{' '}
                    <span className="text-xs text-slate-400">({ss.subject.code})</span>
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {ss.section.name} ({ss.section.code})
                  </p>
                </div>

                <Link
                  href={`/teacher/mark-entry/${ss.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-darkred px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-darkred/20"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                  Enter Marks
                  <ArrowRightCircleIcon className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
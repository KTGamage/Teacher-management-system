import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Link, usePage } from '@inertiajs/react';
import { Bars3Icon, ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

interface Breadcrumb {
  label: string;
  url?: string;
}

interface Props {
  breadcrumbs?: Breadcrumb[];
  onToggleSidebar: () => void;
  onToggleMobile: () => void;
}

export default function Navbar({ breadcrumbs = [], onToggleSidebar, onToggleMobile }: Props) {
  const { url, props } = usePage();
  const user = (props.auth as any)?.user;

  const segments = url.split('/').filter(Boolean);
  const generatedCrumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    return { label: seg.charAt(0).toUpperCase() + seg.slice(1), url: href };
  });
  const crumbs = breadcrumbs.length > 0 ? breadcrumbs : generatedCrumbs;

  return (
    <header className="border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex min-w-0 items-center space-x-3">
          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 lg:hidden"
            onClick={onToggleMobile}
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <button
            className="hidden rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 lg:flex"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex min-w-0 items-center space-x-1 text-slate-500">
              <li>
                <Link href="/" className="text-slate-400 transition hover:text-darkred">
                  <HomeIcon className="h-5 w-5" />
                </Link>
              </li>
              {crumbs.map((crumb, idx) => (
                <li key={crumb.url || idx} className="flex min-w-0 items-center">
                  <ChevronRightIcon className="h-5 w-5 text-slate-300" />
                  {crumb.url && idx < crumbs.length - 1 ? (
                    <Link href={crumb.url} className="ml-1 truncate text-sm font-medium text-slate-500 transition hover:text-darkred">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="ml-1 truncate text-sm font-semibold text-slate-900">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="flex items-center">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-darkred/25">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-darkred text-sm font-bold text-white shadow-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-50 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-slate-900/10">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/profile"
                      className={`${active ? 'bg-slate-50 text-slate-950' : 'text-slate-700'} block px-4 py-2 text-sm`}
                    >
                      Profile
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      className={`${active ? 'bg-slate-50 text-slate-950' : 'text-slate-700'} block w-full px-4 py-2 text-left text-sm`}
                    >
                      Logout
                    </Link>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}

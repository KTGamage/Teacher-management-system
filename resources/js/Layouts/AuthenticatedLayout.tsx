import { ReactNode, useState } from 'react';
import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import { Toaster } from 'react-hot-toast';

interface Breadcrumb {
  label: string;
  url?: string;
}

interface Props {
  children: ReactNode;
  breadcrumbs?: Breadcrumb[];
  subtitle?: string;
}

export default function AuthenticatedLayout({ children, breadcrumbs = [], subtitle }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleMobile = () => setMobileSidebarOpen(!mobileSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onToggleMobile={toggleMobile}
        onToggleCollapse={toggleSidebar}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          breadcrumbs={breadcrumbs}
          onToggleSidebar={toggleSidebar}
          onToggleMobile={toggleMobile}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {subtitle && (
              <p className="mb-3 text-sm font-medium text-slate-500">{subtitle}</p>
            )}
            {children}
          </div>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#8B0000',
            color: '#fff',
            fontFamily: 'var(--font-sans)',
          },
        }}
      />
    </div>
  );
}

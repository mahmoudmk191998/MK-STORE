import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAdmin } from '@/hooks/useAdmin';
import { Loader2, Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, loading } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex bg-muted/30" dir="rtl">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile header */}
      <div className="w-full md:hidden border-b border-border p-3 flex items-center justify-between">
        <button
          aria-label="فتح القائمة"
          className="p-2"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="text-lg font-semibold">لوحة الإدارة</div>

        <div />
      </div>

      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="relative w-64 bg-card border-l border-border min-h-screen p-4">
            <button
              aria-label="إغلاق القائمة"
              className="absolute top-3 left-3 p-2"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <AdminSidebar />
          </aside>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;

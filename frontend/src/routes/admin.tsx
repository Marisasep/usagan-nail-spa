import { useState } from 'react';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { AdminSidebar } from '@/features/admin/components/AdminSidebar';
import { LoginForm } from '@/features/admin/components/LoginForm';
import { getToken, getUser } from '@/shared/utils/api';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  const [authed, setAuthed] = useState(() => !!getToken());
  const navigate = useNavigate();

  function handleLoginSuccess() {
    setAuthed(true);
    const user = getUser();
    if (user?.role === 'technician') {
      navigate({ to: '/admin/schedule' });
    }
  }

  if (!authed) {
    return <LoginForm onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar onLogout={() => setAuthed(false)} />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

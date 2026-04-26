import { Link } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  CalendarDays,
  BookOpen,
  LogOut,
} from 'lucide-react';
import { clearAuth, getUser } from '@/shared/utils/api';

const ROLE_LABELS: Record<string, string> = {
  owner: 'เจ้าของธุรกิจ',
  admin: 'แอดมิน',
  technician: 'ช่าง',
};

export function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const user = getUser();
  const role = user?.role ?? 'technician';

  const links = [
    { to: '/admin', label: 'แดชบอร์ด', icon: LayoutDashboard, roles: ['owner', 'admin'] },
    { to: '/admin/services', label: 'บริการ', icon: Sparkles, roles: ['owner', 'admin'] },
    { to: '/admin/users', label: 'ผู้ใช้', icon: Users, roles: ['owner', 'admin'] },
    { to: '/admin/bookings', label: 'จัดการนัดหมาย', icon: BookOpen, roles: ['owner', 'admin'] },
    { to: '/admin/schedule', label: 'ตารางนัดหมาย', icon: CalendarDays, roles: ['owner', 'admin'] },
  ];

  const visibleLinks = links.filter((l) => l.roles.includes(role));

  function handleLogout() {
    clearAuth();
    onLogout();
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-background">
      <div className="border-b px-5 py-4">
        <Link to="/admin" className="block">
          <span className="text-lg font-bold text-primary">Usagan</span>{' '}
          <span className="text-sm text-muted-foreground">Admin</span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {visibleLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            activeOptions={{ exact: link.to === '/admin' }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            activeProps={{
              className:
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-primary/10 text-primary',
            }}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-3">
        {user && (
          <div className="mb-2 px-3">
            <p className="truncate text-xs font-medium">{user.displayName}</p>
            <p className="text-xs text-muted-foreground">{ROLE_LABELS[role] ?? role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}

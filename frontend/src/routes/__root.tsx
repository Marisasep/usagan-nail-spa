import { createRootRoute, Outlet, ScrollRestoration, useRouterState } from '@tanstack/react-router';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}

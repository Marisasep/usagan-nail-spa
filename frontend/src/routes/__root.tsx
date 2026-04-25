import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Navbar } from '@/shared/components/Navbar';
import { Footer } from '@/shared/components/Footer';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
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

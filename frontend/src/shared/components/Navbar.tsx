import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SHOP_INFO } from '@/shared/utils/constants';

const navLinks = [
  { to: '/', label: 'หน้าแรก' },
  { to: '/services', label: 'บริการ' },
  { to: '/gallery', label: 'ผลงาน' },
  { to: '/booking', label: 'จองคิว' },
  { to: '/contact', label: 'ติดต่อ' },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Usagan</span>
          <span className="text-sm text-muted-foreground">Nail Spa</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: 'text-sm font-medium text-primary' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={`tel:${SHOP_INFO.phone}`} className="flex items-center gap-1 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            {SHOP_INFO.phone}
          </a>
          <Link to="/booking">
            <Button size="sm">จองคิวเลย</Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="mt-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                  activeProps={{ className: 'text-lg font-medium text-primary' }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/booking" onClick={() => setOpen(false)}>
                <Button className="mt-4 w-full">จองคิวเลย</Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

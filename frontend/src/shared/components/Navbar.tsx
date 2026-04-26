import { useState, useEffect, useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { Phone, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current?.contains(e.target as Node) ||
        buttonRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

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

        <div className="relative md:hidden">
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line
                x1="4" y1="6" x2="20" y2="6"
                className={`origin-center transition-all duration-300 ease-in-out ${open ? 'translate-y-1.5 rotate-45' : ''}`}
              />
              <line
                x1="4" y1="12" x2="20" y2="12"
                className={`origin-center transition-all duration-300 ease-in-out ${open ? 'scale-x-0 opacity-0' : ''}`}
              />
              <line
                x1="4" y1="18" x2="20" y2="18"
                className={`origin-center transition-all duration-300 ease-in-out ${open ? '-translate-y-1.5 -rotate-45' : ''}`}
              />
            </svg>
          </Button>

          <div
            ref={menuRef}
            className={`absolute right-0 mt-3 w-64 origin-top-right rounded-xl border bg-popover p-1 shadow-lg transition-all duration-300 ease-out ${
              open
                ? 'scale-100 opacity-100 translate-y-0'
                : 'pointer-events-none scale-95 opacity-0 -translate-y-2'
            }`}
          >
            <nav className="flex flex-col gap-0.5 p-1">
              {navLinks.map((link, i) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                  activeProps={{
                    className:
                      'rounded-lg px-3 py-2.5 text-sm font-medium bg-primary/10 text-primary',
                  }}
                  onClick={() => setOpen(false)}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="px-2 py-1">
              <Separator />
            </div>

            <div className="p-2">
              <Link to="/booking" onClick={() => setOpen(false)}>
                <Button className="w-full" size="sm">
                  จองคิวเลย
                </Button>
              </Link>
            </div>

            <div className="px-2 pb-1">
              <Separator />
            </div>

            <div className="flex flex-col gap-1.5 px-4 py-2 text-xs text-muted-foreground">
              <a href={`tel:${SHOP_INFO.phone}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-3.5 w-3.5" />
                {SHOP_INFO.phone}
              </a>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                {SHOP_INFO.openHours}
              </div>
              <a href={SHOP_INFO.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {SHOP_INFO.address}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

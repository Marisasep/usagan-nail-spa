import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { SHOP_INFO } from '@/shared/utils/constants';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-warm-light/20 py-20 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Premium Nail & Eyelash Spa
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            ให้มือเท้าคุณได้พัก
            <br />
            <span className="text-primary">กับสปาสุดฟิน</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Usagan Nail Spa ร้านทำเล็บและต่อขนตาระดับพรีเมียม
            ดำเนินการโดยพนักงานมืออาชีพ นำเสนอบริการเฉพาะบุคคลที่เป็นเอกลักษณ์
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/booking">
              <Button size="lg" className="text-base">
                จองคิวเลย
              </Button>
            </Link>
            <a href={`tel:${SHOP_INFO.phone}`}>
              <Button variant="outline" size="lg" className="text-base">
                <Phone className="mr-2 h-4 w-4" />
                {SHOP_INFO.phone}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

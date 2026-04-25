import { Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { SHOP_INFO } from '@/shared/utils/constants';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-primary">Usagan Nail Spa</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              ร้านทำเล็บและต่อขนตาระดับพรีเมียม ดำเนินการโดยพนักงานมืออาชีพ
              นำเสนอบริการเฉพาะบุคคลที่เป็นเอกลักษณ์
            </p>
          </div>

          <div>
            <h4 className="font-semibold">ติดต่อเรา</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:${SHOP_INFO.phone}`} className="hover:text-primary">
                  {SHOP_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <a href={SHOP_INFO.lineUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  LINE: @usagan
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <a href={SHOP_INFO.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  {SHOP_INFO.address}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>เปิดทุกวัน {SHOP_INFO.openHours}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">บริการของเรา</h4>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              <li>ทำเล็บเจล</li>
              <li>ต่อเล็บ</li>
              <li>ต่อขนตา</li>
              <li>สปามือและเท้า</li>
              <li>Manicure & Pedicure</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Usagan Nail Spa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

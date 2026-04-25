import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { SHOP_INFO } from '@/shared/utils/constants';

export function ContactInfo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">โทรศัพท์</h3>
              <a
                href={`tel:${SHOP_INFO.phone}`}
                className="text-lg font-bold text-primary hover:underline"
              >
                {SHOP_INFO.phone}
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">LINE</h3>
              <a
                href={SHOP_INFO.lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                แชทกับเราผ่าน LINE
                <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">ที่อยู่</h3>
              <p className="text-muted-foreground">{SHOP_INFO.address}</p>
              <a
                href={SHOP_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="link" className="mt-1 h-auto p-0 text-primary">
                  ดูแผนที่ Google Maps
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="rounded-lg bg-primary/10 p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">เวลาเปิดให้บริการ</h3>
              <p className="text-muted-foreground">
                เปิดทุกวัน {SHOP_INFO.openHours}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.7!2d100.5679!3d13.7237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDQzJzI1LjMiTiAxMDDCsDM0JzA0LjQiRQ!5e0!3m2!1sth!2sth!4v1"
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '400px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Usagan Nail Spa Location"
        />
      </div>
    </div>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '@/shared/utils/constants';

export function Testimonials() {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">รีวิวจากลูกค้า</h2>
          <p className="mt-3 text-muted-foreground">
            ความประทับใจจากลูกค้าที่ไว้วางใจเรา
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.id} className="text-left">
              <CardContent className="pt-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  "{testimonial.comment}"
                </p>
                <p className="mt-4 text-sm font-semibold">{testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

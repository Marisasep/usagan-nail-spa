import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '@/shared/utils/constants';

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-card py-16 md:py-24">
      {/* Decorative dots top-left */}
      <div className="pointer-events-none absolute left-6 top-10 grid grid-cols-3 gap-2 opacity-15">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-warm" />
        ))}
      </div>

      {/* Decorative leaf bottom-right */}
      <svg
        className="pointer-events-none absolute -bottom-4 right-0 h-44 w-44 text-warm-light/25 md:h-56 md:w-56"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M180 180c-20-40-60-80-100-100-10-5-20-8-30-10 30 10 70 30 100 60 10 10 20 25 30 50z"
          fill="currentColor"
        />
        <path
          d="M160 190c-15-35-50-70-90-95-8-4-16-7-24-9 25 8 60 25 85 50 8 8 18 22 29 54z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>

      {/* Small decorative circles */}
      <div className="pointer-events-none absolute bottom-20 left-12 h-6 w-6 rounded-full bg-warm/15" />
      <div className="pointer-events-none absolute right-1/4 top-16 h-4 w-4 rounded-full bg-warm-light/40" />

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

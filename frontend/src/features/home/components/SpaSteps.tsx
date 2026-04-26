import { Card, CardContent } from '@/components/ui/card';
import { SPA_STEPS } from '@/shared/utils/constants';

const stepIcons = ['🛁', '✨', '✂️', '💅', '🦶', '🧴', '💆‍♀️', '🌿'];

export function SpaSteps() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-cream/50 to-background py-16 md:py-24">
      {/* Decorative leaf top-left */}
      <svg
        className="pointer-events-none absolute -top-2 left-0 h-48 w-48 -scale-x-100 text-warm-light/30 md:h-60 md:w-60"
        viewBox="0 0 200 200"
        fill="none"
      >
        <path
          d="M180 20c-20 40-60 80-100 100-10 5-20 8-30 10 30-10 70-30 100-60 10-10 20-25 30-50z"
          fill="currentColor"
        />
        <path
          d="M160 10c-15 35-50 70-90 95-8 4-16 7-24 9 25-8 60-25 85-50 8-8 18-22 29-54z"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>

      {/* Decorative dots bottom-left */}
      <div className="pointer-events-none absolute bottom-8 left-6 grid grid-cols-3 gap-2 opacity-15">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-warm" />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            สปาเข้มข้น 8 ขั้นตอน
          </h2>
          <p className="mt-3 text-muted-foreground">
            ปรนนิบัติมือและเท้า ด้วยสปาระดับพรีเมียม เพียง ฿799
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPA_STEPS.map((step, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl">{stepIcons[index]}</div>
                <div className="mt-2 text-xs font-bold text-primary">
                  ขั้นตอนที่ {index + 1}
                </div>
                <p className="mt-1 text-sm font-medium">{step}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Card, CardContent } from '@/components/ui/card';
import { SPA_STEPS } from '@/shared/utils/constants';

const stepIcons = ['🛁', '✨', '✂️', '💅', '🦶', '🧴', '💆‍♀️', '🌿'];

export function SpaSteps() {
  return (
    <section className="py-16 md:py-24">
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

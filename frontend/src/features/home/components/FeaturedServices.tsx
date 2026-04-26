import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';
import { useServices } from '@/shared/hooks/useServices';

export function FeaturedServices() {
  const { data: services = [] } = useServices();
  const featured = services.slice(0, 3);

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Decorative dots top-right */}
      <div className="pointer-events-none absolute right-8 top-12 grid grid-cols-4 gap-2 opacity-15">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-warm" />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold md:text-4xl">บริการของเรา</h2>
          <p className="mt-3 text-muted-foreground">
            บริการเล็บ ขนตา และสปาครบวงจร โดยช่างมืออาชีพ
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featured.map((service) => (
            <Card key={service.id} className="group transition-shadow hover:shadow-lg">
              <div className="aspect-4/3 overflow-hidden rounded-t-lg bg-muted">
                {service.image ? (
                  <img src={service.image} alt={service.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl">
                    {service.category === 'nail' && '💅'}
                    {service.category === 'eyelash' && '👁️'}
                    {service.category === 'spa' && '🧖‍♀️'}
                    {service.category === 'package' && '✨'}
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="capitalize">
                    {service.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {service.duration} นาที
                  </span>
                </div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{service.description}</p>
                <p className="mt-3 text-2xl font-bold text-primary">
                  ฿{service.price.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/services">
            <Button variant="outline" size="lg">
              ดูบริการทั้งหมด
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

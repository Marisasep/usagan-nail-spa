import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import type { Service } from '@/shared/types';

interface ServiceCardProps {
  service: Service;
}

const categoryLabel: Record<string, string> = {
  nail: 'เล็บ',
  eyelash: 'ขนตา',
  spa: 'สปา',
  package: 'แพ็คเกจ',
};

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="group flex flex-col transition-shadow hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
        <div className="flex h-full items-center justify-center text-5xl">
          {service.category === 'nail' && '💅'}
          {service.category === 'eyelash' && '👁️'}
          {service.category === 'spa' && '🧖‍♀️'}
          {service.category === 'package' && '✨'}
        </div>
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{categoryLabel[service.category]}</Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {service.duration} นาที
          </span>
        </div>
        <CardTitle className="text-lg">{service.nameTh}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="flex-1 text-sm text-muted-foreground">{service.descriptionTh}</p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-2xl font-bold text-primary">฿{service.price.toLocaleString()}</p>
          <Link to="/booking" search={{ service: service.id }}>
            <Button size="sm">จองคิว</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

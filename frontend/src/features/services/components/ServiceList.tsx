import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useServices } from '@/shared/hooks/useServices';
import { ServiceCard } from './ServiceCard';
import type { ServiceCategory } from '@/shared/types';

const categories = [
  { key: 'all' as const, label: 'ทั้งหมด' },
  { key: 'nail' as const, label: 'เล็บ' },
  { key: 'eyelash' as const, label: 'ขนตา' },
  { key: 'spa' as const, label: 'สปา' },
  { key: 'package' as const, label: 'แพ็คเกจ' },
];

export function ServiceList() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all');
  const { data: services = [], isLoading } = useServices();

  const filtered = activeCategory === 'all'
    ? services
    : services.filter((s) => s.category === activeCategory);

  if (isLoading) {
    return <p className="text-center text-muted-foreground">กำลังโหลด...</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.key}
            variant={activeCategory === cat.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}

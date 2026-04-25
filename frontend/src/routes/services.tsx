import { createFileRoute } from '@tanstack/react-router';
import { ServiceList } from '@/features/services/components/ServiceList';

export const Route = createFileRoute('/services')({
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold md:text-4xl">บริการทั้งหมด</h1>
          <p className="mt-3 text-muted-foreground">
            เลือกบริการที่คุณต้องการ เรามีให้ครบทั้งเล็บ ขนตา และสปา
          </p>
        </div>
        <div className="mt-10">
          <ServiceList />
        </div>
      </div>
    </section>
  );
}

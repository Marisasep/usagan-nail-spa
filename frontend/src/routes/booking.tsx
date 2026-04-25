import { createFileRoute } from '@tanstack/react-router';
import { BookingForm } from '@/features/booking/components/BookingForm';

interface BookingSearch {
  service?: string;
}

export const Route = createFileRoute('/booking')({
  validateSearch: (search: Record<string, unknown>): BookingSearch => ({
    service: typeof search.service === 'string' ? search.service : undefined,
  }),
  component: BookingPage,
});

function BookingPage() {
  const { service } = Route.useSearch();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">จองคิว</h1>
          <p className="mt-3 text-muted-foreground">
            จองคิวง่ายๆ แค่กรอกข้อมูล เราจะติดต่อกลับเพื่อยืนยัน
          </p>
        </div>
        <BookingForm preselectedService={service} />
      </div>
    </section>
  );
}

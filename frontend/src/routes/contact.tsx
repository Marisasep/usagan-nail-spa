import { createFileRoute } from '@tanstack/react-router';
import { ContactInfo } from '@/features/contact/components/ContactInfo';

export const Route = createFileRoute('/contact')({
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold md:text-4xl">ติดต่อเรา</h1>
          <p className="mt-3 text-muted-foreground">
            พร้อมให้บริการทุกวัน สอบถามหรือจองคิวได้เลยค่ะ
          </p>
        </div>
        <ContactInfo />
      </div>
    </section>
  );
}

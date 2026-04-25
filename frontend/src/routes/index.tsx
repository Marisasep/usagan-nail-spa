import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '@/features/home/components/Hero';
import { FeaturedServices } from '@/features/home/components/FeaturedServices';
import { SpaSteps } from '@/features/home/components/SpaSteps';
import { Testimonials } from '@/features/home/components/Testimonials';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <SpaSteps />
      <Testimonials />
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { GalleryGrid } from "@/features/gallery/components/GalleryGrid";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold md:text-4xl">ผลงานของเรา</h1>
          <p className="mt-3 text-muted-foreground">
            ชมผลงานจากช่างฝีมือของ Usagan Nail Spa
          </p>
        </div>
        <div className="mt-10">
          <GalleryGrid />
        </div>
      </div>
    </section>
  );
}

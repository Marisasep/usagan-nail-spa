import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const HERO_IMAGES = ["/image/001.jpg", "/image/009.jpg", "/image/008.jpg"];

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#fdf2f0] via-cream to-[#fef9f5] py-16 md:py-24 lg:py-28">
      {/* Decorative leaf top-right */}
      <svg
        className="pointer-events-none absolute -top-4 right-0 h-56 w-56 text-warm-light/40 md:h-72 md:w-72"
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
        <path
          d="M170 40c-10 20-35 50-65 70-6 4-13 7-20 9 20-5 45-20 65-40 7-7 14-18 20-39z"
          fill="currentColor"
          opacity="0.3"
        />
      </svg>

      {/* Decorative dots */}
      <div className="pointer-events-none absolute bottom-10 left-10 grid grid-cols-3 gap-2 opacity-20">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-warm" />
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16 lg:gap-20">
          {/* Left: circular image */}
          <div className="relative shrink-0">
            {/* Outer decorative ring */}
            <div className="absolute -inset-3 rounded-full border-2 border-dashed border-warm-light/50" />

            {/* Image circle */}
            <div className="relative h-72 w-72 overflow-hidden rounded-full border-4 border-white shadow-2xl sm:h-80 sm:w-80 md:h-88 md:w-88 lg:h-104 lg:w-104">
              {HERO_IMAGES.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt="Usagan Nail Spa"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
                  style={{ opacity: index === currentImage ? 1 : 0 }}
                />
              ))}
            </div>

            {/* Promo badge */}
            <div className="absolute -bottom-2 -left-2 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-primary text-white shadow-lg sm:h-28 sm:w-28">
              <span className="text-lg font-bold sm:text-xl">20% OFF</span>
              <span className="text-[10px] leading-tight sm:text-xs">
                จองวันนี้
              </span>
            </div>

            {/* Small decorative circles */}
            <div className="absolute -right-4 top-8 h-8 w-8 rounded-full bg-warm-light/60" />
            <div className="absolute -top-2 left-16 h-5 w-5 rounded-full bg-warm/30" />
          </div>

          {/* Right: text content */}
          <div className="flex-1 text-center md:text-left">
            <img
              src="/logo.jpg"
              alt="Usagan"
              className="mx-auto mb-6 h-20 w-20 rounded-full object-cover md:mx-0"
            />

            <h1 className="font-heading text-4xl leading-tight font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="block italic text-primary">ให้เล็บของคุณ</span>
              <span className="block italic">สวยดูดี</span>
            </h1>

            <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">
              แค่มาครั้งเดียว คุณจะรู้ว่าทำไมเราถึงเป็นที่หนึ่ง บริการเล็บ สปา
              และต่อขนตาระดับพรีเมียม โดยช่างมืออาชีพ
            </p>

            <div className="mt-8">
              <Link to="/booking">
                <Button
                  size="lg"
                  className="rounded-none px-10 py-6 text-base font-semibold uppercase tracking-widest"
                >
                  จองคิวเลย
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 40"
          className="w-full text-background"
          preserveAspectRatio="none"
        >
          <path d="M0 40h1440V20C1200 0 240 0 0 20z" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}

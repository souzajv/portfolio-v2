'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AutoScroll, { type AutoScrollType } from 'embla-carousel-auto-scroll';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href?: string;
  image: string;
  stack?: string[];
  highlightLabel?: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  badgeLabel?: string;
  className?: string;
  items: Gallery4Item[];
}

const Gallery4 = ({
  title = "Case Studies",
  description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences. These case studies showcase real-world applications and success stories.",
  badgeLabel,
  className,
  items = [],
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollRef = useRef<AutoScrollType | null>(null);
  const [isInView, setIsInView] = useState(false);

  const autoScrollPlugin = useMemo(
    () =>
      AutoScroll({
        speed: 1.1,
        startDelay: 0,
        playOnInit: false,
        stopOnMouseEnter: true,
        stopOnInteraction: false,
        stopOnFocusIn: true,
      }),
    []
  );

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    updateSelection();

    autoScrollRef.current = carouselApi.plugins().autoScroll ?? null;

    carouselApi.on('select', updateSelection);
    carouselApi.on('reInit', updateSelection);

    return () => {
      carouselApi.off('select', updateSelection);
      carouselApi.off('reInit', updateSelection);
    };
  }, [carouselApi]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      entries => {
        setIsInView(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.25 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const autoScroll = autoScrollRef.current;
    if (!autoScroll) return;

    if (isInView) {
      autoScroll.play();
    } else {
      autoScroll.stop();
    }
  }, [isInView]);

  useEffect(() => {
    return () => {
      autoScrollRef.current?.stop();
    };
  }, []);

  const handlePrev = () => {
    if (!carouselApi) return;
    carouselApi.scrollPrev();
    autoScrollRef.current?.reset();
  };

  const handleNext = () => {
    if (!carouselApi) return;
    carouselApi.scrollNext();
    autoScrollRef.current?.reset();
  };

  return (
    <div ref={containerRef} className={className}>
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="flex flex-col gap-4">
          {badgeLabel ? (
            <Badge variant="secondary" className="w-fit bg-background text-(--foreground-80)">
              {badgeLabel}
            </Badge>
          ) : null}
          {title ? (
            <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
          ) : null}
          {description ? (
            <p className="max-w-2xl text-base text-(--foreground-70)">{description}</p>
          ) : null}
        </div>
        <div className="hidden shrink-0 gap-2 md:flex">
          <Button
            size="icon"
            variant="ghost"
            onClick={handlePrev}
            disabled={!canScrollPrev}
            className={`rounded-full border border-(--stroke-color) transition disabled:pointer-events-auto ${canScrollPrev
              ? 'bg-white text-slate-900 hover:text-slate-900'
              : 'bg-(--surface-glass) text-(--text-muted-dark) hover:text-(--text-on-dark)'
              }`}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleNext}
            disabled={!canScrollNext}
            className={`rounded-full border border-(--stroke-color) transition disabled:pointer-events-auto ${canScrollNext
              ? 'bg-white text-slate-900 hover:text-slate-900'
              : 'bg-(--surface-glass) text-(--text-muted-dark) hover:text-(--text-on-dark)'
              }`}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-24 bg-[linear-gradient(to_right,rgba(10,14,25,0.85),rgba(10,14,25,0))] blur-[6px] sm:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-24 bg-[linear-gradient(to_left,rgba(10,14,25,0.85),rgba(10,14,25,0))] blur-[6px] sm:block" />
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: 'start',
            loop: items.length > 1,
            dragFree: true,
            containScroll: 'trimSnaps',
            skipSnaps: true,
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              }
            }
          }}
          plugins={[autoScrollPlugin]}
        >
          <CarouselContent className="ml-0">
            {items.map(item => {
              const isExternal = item.href ? /^(https?:)?\/\//.test(item.href) : false;
              const highlightLabel = item.highlightLabel ?? 'Destaque';

              return (
                <CarouselItem
                  key={item.id}
                  className="basis-[92%] px-6 py-4 sm:basis-[72%] md:basis-1/2 lg:basis-[44%] xl:basis-[36%]"
                >
                  <div
                    data-animate="item"
                    className="group relative flex h-full min-h-96 flex-col overflow-hidden rounded-[28px] border border-(--stroke-color) bg-[linear-gradient(180deg,rgba(21,30,47,0.85)_0%,rgba(12,18,32,0.95)_65%,rgba(10,16,28,0.98)_100%)] shadow-[0_8px_32px_-12px_rgba(15,23,42,0.45)] backdrop-blur-sm transition-transform duration-300 ease-out hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_12px_32px_-8px_rgba(59,130,246,0.25)]"
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,23,0.25)_0%,rgba(12,20,34,0.6)_40%,rgba(15,23,42,0.95)_100%)]" />
                      <div
                        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background:
                            'radial-gradient(120% 110% at 50% 0%, rgba(59,130,246,0.35) 0%, rgba(59,130,246,0) 65%)'
                        }}
                      />
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between p-6">
                      <div className="space-y-3">
                        <Badge
                          variant="outline"
                          className="border-(--status-border) bg-(--status-complete-bg) text-(--text-on-dark) shadow-[0_8px_20px_rgba(15,23,42,0.45)]"
                        >
                          {highlightLabel}
                        </Badge>
                        <h3 className="text-lg font-semibold text-(--text-on-dark)">{item.title}</h3>
                        <p className="text-sm text-(--text-muted-dark)">{item.description}</p>
                      </div>

                      {item.stack?.length ? (
                        <div className="mt-6 flex flex-wrap gap-2">
                          {item.stack.map(tag => (
                            <span
                              key={`${item.id}-${tag}`}
                              className="rounded-full border border-(--stroke-color) bg-[rgba(15,23,42,0.32)] px-3 py-1 text-xs uppercase tracking-wide text-(--text-muted-dark) shadow-[inset_0_1px_12px_rgba(148,163,184,0.12)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-6">
                        {item.href ? (
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="border border-(--stroke-color) bg-(--surface-glass) text-(--text-on-dark) transition-colors hover:border-primary hover:bg-[rgba(59,130,246,0.18)]"
                          >
                            <Link
                              href={item.href}
                              target={isExternal ? '_blank' : undefined}
                              rel={isExternal ? 'noreferrer' : undefined}
                              className="flex items-center gap-2"
                            >
                              Ver case
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <div className="rounded-full border border-dashed border-(--stroke-color) px-4 py-2 text-xs text-(--text-muted-dark)">
                            Case em breve
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${currentSlide === index ? 'bg-primary' : 'bg-primary/20'
                }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export { Gallery4 };

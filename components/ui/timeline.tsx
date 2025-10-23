"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  subtitle?: string;
}

interface TimelineProps {
  data: TimelineEntry[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export const Timeline = ({
  data,
  title,
  description,
  className,
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const containerClasses = cn(
    "w-full bg-background px-2 sm:px-4 md:px-10",
    className,
  );

  return (
    <div
      className={containerClasses}
      ref={containerRef}
      style={{ fontFamily: 'var(--font-jetbrains), "JetBrains Mono", monospace' }}
    >
      <div className="w-full mx-auto sm:px-4 md:px-6 md:py-10">
        <h2 className="text-lg sm:text-2xl md:text-4xl mb-2 text-foreground text-balance">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed text-balance">
          {description}
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-14">
        {data.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col md:flex-row justify-start md:gap-10 w-full overflow-x-auto",
              index === 0 ? "pt-8 sm:pt-10" : "pt-8 sm:pt-10 md:pt-28"
            )}
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start w-full max-w-xs sm:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                <div className="h-4 w-4 rounded-full border border-(--stroke-color) bg-border p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-muted-foreground">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-16 pr-2 sm:pl-20 sm:pr-4 md:pl-4 w-full min-w-0">
              <h3 className="md:hidden block text-xl sm:text-2xl mb-4 text-left font-bold text-muted-foreground">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
            display: 'block',
          }}
          className="absolute md:left-8 left-4 top-0 overflow-visible w-0.5 bg-[linear-gradient(to_bottom)] via-neutral-200 dark:via-neutral-100 to-transparent to-1% mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              display: 'block',
            }}
            className="absolute inset-x-0 top-0 w-0.5 bg-linear-to-t from-purple-500 via-blue-500 to-transparent from-0% via-10% rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

'use client';

import type { SpringOptions } from 'motion/react';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

interface TiltedCardProps {
  imageSrc: React.ComponentProps<'img'>['src'];
  altText?: string;
  containerHeight?: React.CSSProperties['height'];
  containerWidth?: React.CSSProperties['width'];
  imageHeight?: React.CSSProperties['height'];
  imageWidth?: React.CSSProperties['width'];
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
  imageClassName?: string;
}

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  containerHeight,
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  overlayContent = null,
  displayOverlayContent = false,
  imageClassName
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const baseRotateX = useMotionValue(0);
  const baseRotateY = useMotionValue(0);
  const rotateX = useSpring(baseRotateX, springValues);
  const rotateY = useSpring(baseRotateY, springValues);
  const scale = useSpring(1, springValues);
  const resolvedContainerHeight = containerHeight ?? 'auto';

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    baseRotateX.set(rotationX);
    baseRotateY.set(rotationY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    scale.set(1);
    baseRotateX.set(0);
    baseRotateY.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full max-w-xs sm:max-w-md md:max-w-lg flex flex-col items-center justify-center aspect-3/4"
      style={{
        height: 'auto',
        width: '100%',
        perspective: '800px'
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          Este efeito é otimizado para desktop. Veja no computador para experiência completa.
        </div>
      )}

      <motion.div
        className="relative w-full h-full"
        style={{
          width: '100%',
          height: '100%',
          aspectRatio: '3/4',
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d'
        }}
      >
        <motion.img
          src={imageSrc}
          alt={altText}
          className={cn(
            'object-cover w-full h-full rounded-2xl border-2 border-(--stroke-color) shadow-[0_8px_24px_-8px_rgba(15,23,42,0.18)]',
            imageClassName
          )}
          style={{
            width: '100%',
            height: '100%',
            aspectRatio: '3/4',
            objectFit: 'cover',
            transform: 'translateZ(0)'
          }}
        />

        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute left-1/2 bottom-4 -translate-x-1/2 w-[90%] max-w-full"
            style={{ zIndex: 2, transform: 'translateZ(30px)' }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>
    </figure>
  );
}

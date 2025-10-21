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
  const resolvedContainerHeight = containerHeight ?? imageHeight;

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
      className="relative w-full h-full flex flex-col items-center justify-center"
      style={{
        height: resolvedContainerHeight,
        width: containerWidth,
        perspective: '800px'
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative"
        style={{
          width: imageWidth,
          height: imageHeight,
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
            'absolute top-0 left-0 object-cover will-change-transform',
            imageClassName ? imageClassName : 'rounded-[15px]'
          )}
          style={{
            width: imageWidth,
            height: imageHeight,
            transform: 'translateZ(0)'
          }}
        />

        {displayOverlayContent && overlayContent && (
          <motion.div
            className="absolute top-0 left-0 will-change-transform"
            style={{ zIndex: 2, transform: 'translateZ(30px)' }}
          >
            {overlayContent}
          </motion.div>
        )}
      </motion.div>
    </figure>
  );
}

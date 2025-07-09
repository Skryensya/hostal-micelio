"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageType = {
  src: string;
  alt: string;
  aspectRatio: "square" | "video" | "vertical";
  className?: string;
};

const ASPECT_RATIOS = {
  square: "aspect-square",
  video: "aspect-[16/9]",
  card: "aspect-[5/4]",
} as const;

function SingleImageView({
  src,
  alt,
  aspectRatio,
  className,
}: {
  src: string;
  alt: string;
  aspectRatio: keyof typeof ASPECT_RATIOS;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full",
        ASPECT_RATIOS[aspectRatio],
        className,
      )}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="bg-gray-200 object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        draggable={false}
      />
    </div>
  );
}

function NavigationButton({
  onClick,
  direction,
  label,
  accentColor,
}: {
  onClick: () => void;
  direction: "prev" | "next";
  label: string;
  accentColor?: string;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const position = direction === "prev" ? "left-2" : "right-2";

  return (
    <button
      onClick={onClick}
      aria-label={label}
      tabIndex={-1}
      className={`absolute ${position} top-1/2 -translate-y-1/2 p-2 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100`}
    >
      {/* Visual button - smaller on mobile */}
      <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-full p-1.5 shadow-lg transition-all duration-200 hover:bg-white hover:scale-105 sm:p-2">
        <Icon 
          className="h-3 w-3 sm:h-4 sm:w-4" 
          style={{ color: accentColor || '#6b7280' }}
          strokeWidth={2}
        />
      </div>
    </button>
  );
}

function NavigationDots({
  total,
  current,
  onDotClick,
  accentColor,
}: {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
  accentColor?: string;
}) {
  return (
    <div
      className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5"
      role="tablist"
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = current === index;
        
        return (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            tabIndex={-1}
            aria-label={`Ir a la imagen ${index + 1}`}
            aria-selected={isActive}
            role="tab"
            className={`rounded-full transition-all duration-200 ${
              isActive ? "h-2 w-6" : "h-2 w-2 hover:opacity-80"
            }`}
            style={{
              backgroundColor: isActive ? (accentColor || 'white') : 'rgba(255, 255, 255, 0.6)',
            }}
          />
        );
      })}
    </div>
  );
}

export function ImageCarousel({
  imgs = [],
  aspectRatio = "square",
  ctaRef,
  className,
  onClick,
  accentColor,
}: {
  imgs?: ImageType[];
  aspectRatio?: keyof typeof ASPECT_RATIOS;
  ctaRef?: React.RefObject<HTMLElement>;
  className?: string;
  onClick?: () => void;
  accentColor?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const total = imgs?.length || 0;
  const touchStartX = useRef<number | null>(null);
  // const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);
  const isHovered = useRef(false);
  const [timerProgress, setTimerProgress] = useState(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Timer functionality
  const startTimer = useCallback(() => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    setTimerProgress(0);
    
    timerInterval.current = setInterval(() => {
      setTimerProgress(prev => {
        const newProgress = prev + (100 / 40); // 4 seconds = 4000ms, update every 100ms
        if (newProgress >= 100) {
          setCurrent(current => (current + 1) % total);
          return 0;
        }
        return newProgress;
      });
    }, 100);
  }, [total]);

  const stopTimer = useCallback(() => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    setTimerProgress(0);
  }, []);


  const goNext = useCallback(() => {
    if (isTransitioning || total <= 1) return;
    setIsTransitioning(true);
    setCurrent(prev => (prev + 1) % total);
    stopTimer();
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, total, stopTimer]);

  const goPrev = useCallback(() => {
    if (isTransitioning || total <= 1) return;
    setIsTransitioning(true);
    setCurrent(prev => (prev - 1 + total) % total);
    stopTimer();
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, total, stopTimer]);

  const goToIndex = useCallback((index: number) => {
    if (isTransitioning || index === current || total <= 1) return;
    setIsTransitioning(true);
    setCurrent(index);
    stopTimer();
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, current, total, stopTimer]);

  const handleMouseEnter = useCallback(() => {
    if (window.innerWidth >= 640 && total > 1) {
      isHovered.current = true;
      startTimer();
    }
  }, [startTimer, total]);

  const handleMouseLeave = useCallback(() => {
    isHovered.current = false;
    stopTimer();
  }, [stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    
    touchStartX.current = null;
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "Tab" && ctaRef?.current) {
      e.preventDefault();
      ctaRef.current.focus();
    }
  };

  if (total <= 0) return null;

  if (total === 1) {
    return (
      <SingleImageView
        {...imgs[0]}
        aspectRatio={aspectRatio}
        className={className}
      />
    );
  }

  return (
    <div
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative h-full w-full outline-none overflow-hidden rounded-lg",
        ASPECT_RATIOS[aspectRatio],
        className,
      )}
    >
      <button
        onClick={onClick}
        className="relative h-full w-full"
        tabIndex={-1}
      >
        {/* Image container with smooth transitions */}
        <div className="relative h-full w-full bg-gray-200">
          {imgs.map((img, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: index === current ? 1 : 0,
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
            >
              <Image
                src={img.src || "/placeholder.svg"}
                alt={img.alt}
                fill
                className="object-cover bg-gray-200"
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>

        {/* Timer progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 hidden sm:block">
          <motion.div
            className="h-full transition-all duration-75 ease-linear"
            style={{ 
              backgroundColor: accentColor || '#6b7280',
              width: `${timerProgress}%`
            }}
          />
        </div>
      </button>

      {/* Navigation buttons */}
      <NavigationButton
        onClick={goPrev}
        direction="prev"
        label="Imagen anterior"
        accentColor={accentColor}
      />
      <NavigationButton
        onClick={goNext}
        direction="next"
        label="Siguiente imagen"
        accentColor={accentColor}
      />

      {/* Navigation dots */}
      <NavigationDots
        total={total}
        current={current}
        onDotClick={goToIndex}
        accentColor={accentColor}
      />
    </div>
  );
}
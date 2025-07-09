"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  gap?: number;
}

export function Marquee({
  children,
  className,
  speed = 50,
  pauseOnHover = true,
  direction = "left",
  gap = 20,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScroll, setCanScroll] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) return;

    const updateDimensions = () => {
      const containerRect = container.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      
      setContainerWidth(containerRect.width);
      setContentWidth(contentRect.width);
      setCanScroll(contentRect.width > containerRect.width);
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);
    resizeObserver.observe(content);

    return () => {
      resizeObserver.disconnect();
    };
  }, [children]);

  useEffect(() => {
    if (!canScroll || isHovered) return;

    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let startTime: number;
    const pausedTime = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      
      const elapsed = currentTime - startTime - pausedTime;
      const distance = (elapsed / 1000) * speed;
      
      if (direction === "left") {
        const maxScroll = contentWidth - containerWidth + gap;
        const newPosition = distance % (maxScroll + gap);
        setScrollPosition(-newPosition);
      } else {
        const maxScroll = contentWidth - containerWidth + gap;
        const newPosition = distance % (maxScroll + gap);
        setScrollPosition(newPosition - maxScroll);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [canScroll, isHovered, speed, direction, contentWidth, containerWidth, gap]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsHovered(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!canScroll) return;
    
    const target = e.target as HTMLDivElement;
    setScrollPosition(-target.scrollLeft);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="overflow-x-auto scrollbar-hide"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <div
          ref={contentRef}
          className="flex items-center transition-transform duration-100 ease-linear"
          style={{
            transform: canScroll && !isHovered ? `translateX(${scrollPosition}px)` : undefined,
            gap: `${gap}px`,
            width: "max-content",
          }}
        >
          {children}
          {canScroll && (
            <>
              <div style={{ width: gap }} />
              {children}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
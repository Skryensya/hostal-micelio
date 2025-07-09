"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AutoMarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  gap?: number;
  pauseOnHover?: boolean;
}

export function AutoMarquee({
  children,
  className,
  speed = 50,
  gap = 20,
  pauseOnHover = false,
}: AutoMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const [, setContainerWidth] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const updateDimensions = () => {
      const containerRect = container.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      setContainerWidth(containerRect.width);
      setContentWidth(contentRect.width / 3); // Divide by 3 since we have 3 copies
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);
    resizeObserver.observe(content);

    return () => {
      resizeObserver.disconnect();
    };
  }, [children]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  const handleScroll = () => {
    setIsUserScrolling(true);
    setIsPaused(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Resume auto-scroll after user stops scrolling
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
      if (!pauseOnHover) {
        setIsPaused(false);
      }
    }, 2000);
  };

  const animationDuration = contentWidth > 0 ? contentWidth / speed : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden overflow-y-visible",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="scrollbar-hide overflow-x-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onScroll={handleScroll}
      >
        <div
          ref={contentRef}
          className="flex items-start"
          style={{
            gap: `${gap}px`,
            width: "max-content",
            animation:
              !isPaused && !isUserScrolling
                ? `marquee ${animationDuration}s linear infinite`
                : "none",
          }}
        >
          {/* First set */}
          {children}
          {/* Second set */}
          {children}
          {/* Third set */}
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${contentWidth}px);
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

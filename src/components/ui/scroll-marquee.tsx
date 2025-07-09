"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollMarqueeProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
  speed?: number;
  gap?: number;
}

export function ScrollMarquee({
  children,
  className,
  direction = "left",
  speed = 1,
  gap = 20,
}: ScrollMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const containerRect = container.getBoundingClientRect();
      const containerTop = containerRect.top + scrollY;
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;
      
      // Calculate if the element is in viewport with extended range
      const viewportStart = scrollY - windowHeight * 0.5;
      const viewportEnd = scrollY + windowHeight * 1.5;
      const isInView = viewportEnd > containerTop && 
                       viewportStart < containerTop + containerHeight;
      
      if (isInView) {
        // Calculate scroll progress with gentle but sufficient movement
        const elementCenter = containerTop + containerHeight / 2;
        const viewportCenter = scrollY + windowHeight / 2;
        const distanceFromCenter = (viewportCenter - elementCenter) / (windowHeight * 1.8 + containerHeight);
        
        const contentWidth = content.scrollWidth;
        const containerWidth = container.offsetWidth;
        const maxScroll = contentWidth - containerWidth;
        
        if (maxScroll > 0) {
          // Balanced multiplier for gentle but visible movement
          const scrollMultiplier = Math.max(0.3, Math.min(0.7, speed * 0.6));
          const newPosition = direction === "left" 
            ? -(distanceFromCenter * maxScroll * scrollMultiplier)
            : (distanceFromCenter * maxScroll * scrollMultiplier);
          
          // Extended range to show more cards while keeping smooth movement
          const clampedPosition = Math.max(-maxScroll * 1.0, Math.min(maxScroll * 1.0, newPosition));
          setScrollPosition(clampedPosition);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
    >
      <div
        ref={contentRef}
        className="flex items-center transition-transform duration-1000 ease-out"
        style={{
          transform: `translateX(${scrollPosition}px)`,
          gap: `${gap}px`,
          width: "max-content",
        }}
      >
        {children}
      </div>
    </div>
  );
}
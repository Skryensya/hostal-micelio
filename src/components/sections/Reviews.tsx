"use client";

import SCRAPED_REVIEWS from "@/db/SCRAPED_REVIEWS.json";
import { ReviewCard } from "@/components/composed/ReviewCard";
// import { Button } from "@/components/ui/button";
import { ScrollMarquee } from "@/components/ui/scroll-marquee";
import { AutoMarquee } from "@/components/ui/auto-marquee";
import { MessageCircle } from "lucide-react";
// import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Review } from "@/lib/types";

const Reviews = () => {
  // Use the reviews from scraped data
  const REVIEWS = SCRAPED_REVIEWS.reviews;
  
  // Divide reviews into 2 rows
  const reviewsPerRow = Math.ceil(REVIEWS.length / 2);
  const row1 = REVIEWS.slice(0, reviewsPerRow);
  const row2 = REVIEWS.slice(reviewsPerRow);

  const [maxHeight, setMaxHeight] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const measureCards = () => {
      let maxCardHeight = 0;

      cardRefs.current.forEach((cardRef) => {
        if (cardRef) {
          const { height } = cardRef.getBoundingClientRect();
          if (height > maxCardHeight) maxCardHeight = height;
        }
      });

      setMaxHeight(maxCardHeight);
    };

    // Wait for all cards to render, then measure
    const timer = setTimeout(measureCards, 500);

    // Also measure on resize
    window.addEventListener("resize", measureCards);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measureCards);
    };
  }, []);

  // Component for individual card with its own useInView
  const AnimatedReviewCard = ({
    review,
    index,
  }: {
    review: Review;
    index: number;
  }) => {
    const triggerRef = useRef(null);
    const isInView = useInView(triggerRef, { once: true, amount: 0.5 });

    return (
      <div ref={triggerRef} key={index}>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 40, scale: 0.95 }
          }
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{
            height: maxHeight > 0 ? `${maxHeight}px` : "auto",
          }}
        >
          <ReviewCard review={review} />
        </motion.div>
      </div>
    );
  };

  return (
    <div className="w-full py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h2 className="mb-6 flex items-center justify-start gap-2 text-4xl font-bold text-gray-900 md:text-5xl">
            <MessageCircle className="text-primary h-8 w-8" />
            Lo que opinan nuestros huéspedes
          </h2>
          <p className="text-lg leading-relaxed text-gray-600">
            Descubre las experiencias auténticas de quienes ya han vivido la
            magia de nuestro hostal
          </p>
        </div>
      </div>

      {/* Desktop version - 2 rows with scroll-based movement */}
      <div className="hidden w-full md:block">
        <ScrollMarquee className="pb-4" direction="left" speed={0.8} gap={32}>
          {row1.map((review, index) => (
            <div
              key={`row1-${index}`}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
            >
              <AnimatedReviewCard review={review} index={index} />
            </div>
          ))}
        </ScrollMarquee>

        <ScrollMarquee className="py-4" direction="right" speed={0.6} gap={32}>
          {row2.map((review, index) => (
            <div
              key={`row2-${index}`}
              ref={(el) => {
                cardRefs.current[row1.length + index] = el;
              }}
            >
              <AnimatedReviewCard review={review} index={row1.length + index} />
            </div>
          ))}
        </ScrollMarquee>
      </div>

      {/* Mobile version - 1 row with auto-scroll and infinite loop */}
      <div className="w-full md:hidden">
        <AutoMarquee className="py-4" speed={30} gap={24} pauseOnHover={false}>
          {REVIEWS.map((review, index) => (
            <div
              key={`mobile-${index}`}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
            >
              <AnimatedReviewCard review={review} index={index} />
            </div>
          ))}
        </AutoMarquee>
      </div>
      {/* 
      <div className="mt-16 flex justify-center">
        <Link href="/reviews">
          <Button
            variant="outline"
            size="default"
            className="hover:bg-primary hover:text-primary-foreground rounded-full border-2 px-8 py-3 text-lg font-semibold transition-all duration-300"
          >
            Ver Todas las Reseñas
          </Button>
        </Link>
      </div> */}
    </div>
  );
};

export { Reviews };

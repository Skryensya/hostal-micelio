"use client";

import { useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ReviewCard } from "@/components/composed/ReviewCard";
import SCRAPED_REVIEWS from "@/db/SCRAPED_REVIEWS.json";

export function ReviewSection() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  if (isInView) {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="masonry-container" ref={ref}>
        {SCRAPED_REVIEWS.reviews.sort((a, b) => a.text.length - b.text.length).map(
          (review, index) => (
            <motion.div
              key={`${index}`}
              custom={index}
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
            >
              <ReviewCard review={review} />
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ReviewCard } from "@/components/composed/ReviewCard";
import REVIEWS from "@/db/REVIEWS.json";

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
    <div className="container mx-auto py-8">
      <div className="masonry-container" ref={ref}>
        {REVIEWS.sort((a, b) => a.comment.length - b.comment.length).map(
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

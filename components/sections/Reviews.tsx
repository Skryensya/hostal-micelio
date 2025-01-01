"use client";

import REVIEWS from "@/db/REVIEWS.json";
import { ReviewCard } from "@/components/composed/ReviewCard";

const Reviews = () => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="mb-6 text-2xl flex items-center gap-2">
        Lo que opinan nuestros Huespedes
      </h2>
      <div className=" h-fit max-h-[500px] overflow-hidden">
        <div className="masonry-container">
          {REVIEWS.sort((a, b) => a.comment.length - b.comment.length).map(
            (review, index) => (
              <ReviewCard key={`${index}`} review={review} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export { Reviews };

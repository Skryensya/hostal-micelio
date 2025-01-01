"use client";

import REVIEWS from "@/db/REVIEWS.json";
import { ReviewCard } from "@/components/composed/ReviewCard";
import { Button } from "@/components/ui/button";
import { MessageCircleHeart } from "lucide-react";
import Link from "next/link";

const Reviews = () => {
  return (
    <div className="container mx-auto py-8 ">
      <h2 className="mb-6 text-2xl flex items-center gap-2">
        <MessageCircleHeart className="w-8 h-8" />
        Lo que opinan nuestros Huespedes
      </h2>
      <div className=" h-fit max-h-[500px] overflow-hidden gradient-surface-light mb-6 ">
        <div className="masonry-container">
          {REVIEWS.sort((a, b) => a.comment.length - b.comment.length).map(
            (review, index) => (
              <ReviewCard key={`${index}`} review={review} size="sm" />
            )
          )}
        </div>
      </div>
      <div className="flex flex-row justify-center translate-y-[-40px]">
        <Link href="/reviews">
          <Button variant="outline">Ver Todas las Reseñas</Button>
        </Link>
      </div>
    </div>
  );
};

export { Reviews };

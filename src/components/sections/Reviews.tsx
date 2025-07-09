"use client";

import REVIEWS from "@/db/REVIEWS.json";
import { ReviewCard } from "@/components/composed/ReviewCard";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

const Reviews = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 ">
      <h2 className="mb-6 text-2xl flex items-center gap-2">
        <MessageCircle className="w-8 h-8" />
        Lo que opinan nuestros huéspedes
      </h2>
      <div className=" h-fit max-h-[600px] overflow-hidden gradient-surface mb-6 ">
        <div className="masonry-container">
          {REVIEWS.sort((a, b) => a.comment.length - b.comment.length).map(
            (review, index) => (
              <ReviewCard key={`${index}`} review={review} size="sm" />
            )
          )}
        </div>
      </div>
      <div className="flex flex-row justify-center translate-y-[-10px]">
        <Link href="/reviews">
          <Button variant="outline">Ver Todas las Reseñas</Button>
        </Link>
      </div>
    </div>
  );
};

export { Reviews };

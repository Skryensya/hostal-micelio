import { ReviewCard } from "@/components/composed/ReviewCard";
import REVIEWS from "@/db/REVIEWS.json";

export function ReviewSection() {
  return (
    <div className="container mx-auto py-8">
      <div className="masonry-container">
        {REVIEWS.sort((a, b) => a.comment.length - b.comment.length).map(
          (review, index) => (
            <ReviewCard key={`${index}`} review={review} />
          )
        )}
      </div>
    </div>
  );
}

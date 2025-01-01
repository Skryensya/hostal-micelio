import { ReviewCard } from "@/components/composed/ReviewCard";
import { InnerHero } from "@/components/sections/InnerHero";
import REVIEWS from "@/db/REVIEWS.json";

export default function ReviewsPage() {
  return (
    <div>
      <InnerHero title="Lo que opinan nuestros huespedes"></InnerHero>

      <div className="container mx-auto py-8">
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
}

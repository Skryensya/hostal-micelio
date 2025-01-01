import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Review } from "@/lib/types";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center gap-4 p-6 pb-0">
        <Avatar className="w-10 h-10 bg-gray-200">
          <AvatarImage src={review.url} alt={review.name} />
          <AvatarFallback hue={review.hue}>
            {review.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <p className="text-lg font-medium">{review.name}</p>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <p className="text-sm">{review.comment}</p>
        <div className="flex flex-row items-center gap-2">
          <StarIcon className="w-4 h-4" />
          <p className="text-sm">5</p>
        </div>
        <div className="flex flex-row justify-end gap-2">
          <a href={review.url} target="_blank" rel="noopener noreferrer">
            Ver Reseña
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export { ReviewCard };

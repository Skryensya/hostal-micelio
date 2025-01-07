import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Review } from "@/lib/types";
import { StarIcon, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const ReviewCard = ({
  review,
  size = "md",
}: {
  review: Review;
  size?: "sm" | "md";
}) => {
  return (
    <Card
      style={{
        backgroundColor: `hsl(${review.hue} 70% 90% / 0.5)`,
      }}
      className={`shadow shadow-[hsl(${review.hue} 70% 98%)] text-text-light`}
    >
      <CardHeader className="flex flex-row items-center md:gap-4 p-4 md:p-6 md:pb-0 space-y-0 justify-between">
        <div className="flex flex-row items-center gap-2">
          <Avatar className="h-6 w-6 md:h-10 md:w-10 aspect-square bg-gray-200">
            <AvatarImage src={review.url} alt={review.name} />
            <AvatarFallback hue={review.hue}>
              {review.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm md:text-lg font-bold md:font-medium">
            {review.name}
          </p>
        </div>

        <div
          className="flex flex-row items-center gap-1 pb-1"
          title="5 estrellas"
        >
          <span className="text-xs pt-0.5">5</span>
          <StarIcon
            className="w-5 h-5   text-yellow-300/70"
            fill="rgb(253 224 71 / 0.7)"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 md:px-6 nd:pt-4">
        <p
          className={cn("text-base text-balance", size === "sm" && "text-base")}
        >
          {review.comment}
        </p>

        <div className="pt-4 flex flex-row justify-end">
          <a
            href={review.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline flex flex-row items-center gap-1 font-medium"
          >
            <span className="pt-1">
              Ir a la reseña <span className="sr-only">de {review.name}</span>
            </span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export { ReviewCard };

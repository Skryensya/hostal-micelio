import { Card } from "@/components/ui/card";
import { Review } from "@/lib/types";
import { StarIcon, ExternalLink, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import TiltContainer from "@/components/ui/TiltContainer";
import { useRef, useEffect, useState } from "react";

const getColorFromString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const getRelativeTime = (dateString: string) => {
  // Parse date from dd/mm/yyyy format
  const [day, month, year] = dateString.split('/').map(Number);
  const reviewDate = new Date(year, month - 1, day);
  const now = new Date();
  
  const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffYears > 0) {
    return diffYears === 1 ? 'hace 1 año' : `hace ${diffYears} años`;
  } else if (diffMonths > 0) {
    return diffMonths === 1 ? 'hace 1 mes' : `hace ${diffMonths} meses`;
  } else if (diffDays > 7) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'hace 1 semana' : `hace ${weeks} semanas`;
  } else if (diffDays > 0) {
    return diffDays === 1 ? 'hace 1 día' : `hace ${diffDays} días`;
  } else {
    return 'hoy';
  }
};

const ReviewCard = ({ review }: { review: Review }) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLQuoteElement>(null);
  const hue = getColorFromString(review.author);
  
  useEffect(() => {
    const element = textRef.current;
    if (element) {
      // Check if text is truncated by comparing scrollHeight to clientHeight
      setIsTruncated(element.scrollHeight > element.clientHeight);
    }
  }, [review.text]);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TiltContainer
      tiltIntensity={12}
      transitionSpeed={0.15}
      resetSpeed={0.6}
      shineEffect={true}
      shadowColor={`${Math.round((review.hue * 360) / 100)}, 50%, 50%`}
    >
      <Card
        style={
          {
            "--hue": hue,
            background: `linear-gradient(135deg, hsl(${hue} 60% 88%) 0%, hsl(${hue} 70% 95%) 30%, white 60%)`,
          } as React.CSSProperties
        }
        className={cn(
          "relative",
          "border border-gray-200/60 shadow-sm",
          "overflow-hidden text-gray-900",
          "flex w-80 md:w-96 h-full flex-col rounded-2xl", // Fixed width, dynamic height
        )}
      >
        {/* Quote icon */}
        <div className="absolute top-6 right-6 rotate-12 opacity-40">
          <Quote
            className="h-8 w-8 drop-shadow-sm"
            style={{
              color: `hsl(${hue} 60% 45%)`,
            }}
          />
        </div>

        {/* Avatar en esquina superior izquierda */}

        <div className="relative z-10 flex h-full">
          {/* Main content area - full width */}
          <div className="flex flex-1 flex-col p-5">
            {/* Header with name and rating */}
            <div className="mb-3 flex items-center gap-3">
              <a
                href={review.reviewerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <div
                  className="h-12 w-12 -rotate-4 transform rounded-2xl text-sm font-bold text-white shadow-lg cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue} 65% 45%), hsl(${hue} 70% 75%))`,
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    {getInitials(review.author)}
                  </div>
                </div>
              </a>
              <div className="flex-1">
                <p className="font-heading text-sm font-bold text-gray-900">
                  {review.author}
                </p>
                
                {/* Date */}
                <p className="text-xs text-gray-500 mb-1">
                  {getRelativeTime(review.date)}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className="h-2.5 w-2.5"
                      fill="#fbbf24"
                      stroke="#f59e0b"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Review content - full width */}
            <blockquote 
              ref={textRef}
              className={cn(
                "mb-3 text-base md:text-sm leading-tight text-gray-700 italic flex-1",
                "md:line-clamp-4", // Only clamp on desktop
                isTruncated && "md:[&:after]:ml-1 md:[&:after]:content-['...']"
              )}
            >
              &ldquo;{review.text}&rdquo;
            </blockquote>

            {/* Button at the end - centered */}
            <div className="flex justify-end mt-auto">
              <a
                href={review.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  "rounded-full px-3 py-1.5 shadow-sm",
                )}
                style={{
                  backgroundColor: `hsl(${hue} 60% 80%)`,
                  color: `hsl(${hue} 60% 30%)`,
                }}
              >
                <span className="font-bold">Ver más</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </Card>
    </TiltContainer>
  );
};

export { ReviewCard };

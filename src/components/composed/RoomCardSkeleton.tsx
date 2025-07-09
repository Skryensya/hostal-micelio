import { Skeleton } from "@/components/ui/skeleton";

export function RoomCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 via-gray-50/30 to-white" />

      <div className="relative flex flex-col gap-2 pb-4 md:flex-row md:gap-4">
        {/* Image */}
        <div className="w-full flex-shrink-0 md:w-80">
          <div className="h-56 w-full overflow-hidden rounded-4xl md:h-72">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        {/* Content */}
        <div className="relative flex flex-1 flex-col justify-between rounded-[28px] p-4">
          {/* Inner muted gradient */}
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-gray-100/40 via-gray-50/20 to-gray-50" />

          <div className="relative">
            {/* Header */}
            <div className="mb-3">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  {/* Name */}
                  <Skeleton className="mb-2 h-6 w-48" />

                  {/* Tags */}
                  <div className="mb-2 -ml-2 flex flex-wrap gap-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-5 w-28 rounded-full" />
                    ))}
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>

                {/* Price */}
                <div className="ml-4 text-right">
                  <Skeleton className="mb-1 h-7 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            {/* Features & CTA */}
            <div className="space-y-6 md:grid md:grid-cols-3 md:items-end md:gap-4 md:space-y-0">
              {/* Beds */}
              <div className="space-y-1 md:col-span-2">
                <Skeleton className="h-3 w-12" />
                <div className="flex gap-1">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-8" />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex justify-end md:col-span-1">
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

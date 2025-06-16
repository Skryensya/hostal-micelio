import { Skeleton } from "@/components/ui/skeleton";

export function RoomCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 shadow border-gray-200">
      {/* Gradient background container */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-100/40 via-gray-50/20 to-gray-50" />

      {/* Content container */}
      <div className="relative flex flex-col gap-4 p-4 md:flex-row md:gap-6">
        {/* Image Section */}
        <div className="w-full flex-shrink-0 md:w-80">
          <div className="h-48 w-full overflow-hidden rounded-xl md:h-64">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Header */}
          <div className="mb-3">
            <div className="mb-2 flex items-start justify-between">
              <div className="flex-1">
                {/* Room name */}
                <Skeleton className="mb-2 h-6 w-48" />

                {/* Tags container */}
                <div className="mb-2 flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-28 rounded-full" />
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

          {/* Amenities & Beds & CTA - Same line */}
          <div className="grid items-end gap-4 md:grid-cols-9">
            {/* Beds */}
            <div className="col-span-2 space-y-1">
              <Skeleton className="h-3 w-12" />
              <div className="flex gap-1">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>

            {/* Amenities */}
            <div className="col-span-4 space-y-1">
              <Skeleton className="h-3 w-16" />
              <div className="flex gap-1 flex-wrap">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-6 rounded" />
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="col-span-3 flex justify-end">
              <Skeleton className="h-8 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

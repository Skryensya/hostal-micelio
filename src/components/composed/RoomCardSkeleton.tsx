import { Skeleton } from "@/components/ui/skeleton";
import { WavyDivider } from "@/components/composed/WavyDivider";

export function RoomCardSkeleton() {
  return (
    <div className="relative flex flex-col h-fit md:h-full w-full bg-surface-2 text-text rounded-[1.6rem] overflow-hidden isolate shadow-md">
      {/* Header */}
      <div className="absolute inset-x-0 top-0 z-10 flex flex-col">
        <div className="px-4 pt-1 flex justify-between items-end bg-surface-2">
          <div className="flex flex-col items-start translate-y-1">
            <Skeleton className="w-24 h-3 mb-1" />
            <Skeleton className="w-40 h-6" />
          </div>
          <Skeleton className="w-10 h-4 mb-2" />
        </div>
        {/* Divider igual al componente real */}
        <WavyDivider direction="bottom" backgroundClass="bg-surface-2" />
      </div>

      {/* Imagen / Carousel */}
      <Skeleton className="w-full aspect-square border border-surface-2 rounded-t-[1.6rem]" />

      {/* Body */}
      <div className="flex flex-col px-3 pt-2 gap-4 h-full">
        {/* Descripción */}
        <div className="flex flex-col gap-1">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
        </div>

        {/* Camas */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-12 rounded" />
          ))}
        </div>

        {/* Amenidades */}
        <div className="flex gap-1 flex-wrap">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-lg" />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto -mx-4">
          {/* Divider superior */}
          <WavyDivider direction="top" backgroundClass="bg-primary/20 " noAlpha />

          <div className="px-4 bg-primary/20 pb-4 pt-2 mt-1">
            <Skeleton className="w-24 h-4 mb-2" />

            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function RoomCardSkeleton() {
  return (
    <div className="grid grid-cols-1 h-full w-full bg-surface-2 text-text rounded-[2rem] overflow-hidden">
      <Skeleton className="w-full aspect-video rounded-t-[2rem]" />
      <div className="flex flex-col justify-between p-4 min-h-48">
        <div className="flex flex-col items-start">
          <div className="text-xs font-bold font-mono text-text-muted leading-[20px]">
            <Skeleton className="w-32 h-4" />
          </div>
          <div className="font-bold text-xl">
            <Skeleton className="w-40 h-6 mt-2" />
          </div>
          {/* Se elimina la descripción */}
        </div>
        <div className="flex items-center justify-end gap-2">
          <Skeleton className="w-24 h-8" />
        </div>
      </div>
    </div>
  );
}

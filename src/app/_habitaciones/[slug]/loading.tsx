import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        </div>
        
        <div className="space-y-6">
          <div>
            <Skeleton className="h-10 w-2/3 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          <Skeleton className="h-[200px] w-full rounded-xl" />

          <div className="space-y-4">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>

            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
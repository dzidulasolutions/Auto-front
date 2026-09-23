import Skeleton from "@/components/ui/skeleton";

export default function ClientDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full shrink-0" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-4 flex flex-col gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-36" />
          </div>
        ))}
      </div>
    </div>
  );
}
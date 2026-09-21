import Skeleton from "@/components/ui/skeleton";

export default function ClientsListSkeleton({ rows = 6 }: { rows?: number }) {
  const items = Array.from({ length: rows });

  return (
    <>
      {/* mobile */}
      <ul className="lg:hidden flex flex-col gap-2">
        {items.map((_, i) => (
          <li key={i} className="bg-white p-4 flex items-center gap-3">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-3 w-20" />
          </li>
        ))}
      </ul>

      {/* desktop */}
      <div className="hidden lg:flex flex-col gap-2">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-white px-4 py-3 grid grid-cols-[2fr_1.2fr_1.2fr_1.2fr_1fr] items-center gap-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </>
  );
}
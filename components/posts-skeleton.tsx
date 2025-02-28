import { Skeleton } from "@/components/ui/skeleton"

export function PostsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />

            <Skeleton className="h-64 w-full" />
          </div>

          <div className="bg-gray-50 px-4 py-2 flex items-center border-t">
            <div className="flex items-center gap-1">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-6 w-8 mx-1" />
              <Skeleton className="h-6 w-6 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


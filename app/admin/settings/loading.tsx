import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="p-6 rounded-lg border">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-6" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

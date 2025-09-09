import { Skeleton } from "@kit/ui/skeleton";

export default function VoicesLoading() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-10 w-[100px]" />
            </div>
            <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        </div>
    );
} 
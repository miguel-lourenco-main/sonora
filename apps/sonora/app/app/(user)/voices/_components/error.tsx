'use client';

export default function VoicesError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <h2 className="text-lg font-semibold">Something went wrong!</h2>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <button
                onClick={reset}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
            >
                Try again
            </button>
        </div>
    );
} 
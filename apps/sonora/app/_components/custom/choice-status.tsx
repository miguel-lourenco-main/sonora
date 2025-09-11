import { CheckCircle2 } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@kit/ui/lib";
import { Loader2 } from "lucide-react";
import { buttonStyles } from "@kit/ui/button";

export default function ChoiceStatus({
    isProcessing,
    isCapturing,
    isMakingChoice,
}: {
    isProcessing: boolean;
    isCapturing: boolean;
    isMakingChoice: boolean;
}) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={cn(
                    "relative flex items-center gap-2",
                    buttonStyles.sizes.default,
                    isProcessing && "text-yellow-500 border-yellow-500",
                    isCapturing && "text-blue-500 border-blue-500",
                    isMakingChoice && "text-green-500 border-green-500"
                )}
            >
                {isProcessing ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                </>
                ) : isCapturing ? (
                <>
                    <CheckCircle2 className="h-4 w-4" />
                    Capturing choice...
                </>
                ) : isMakingChoice ? (
                <>
                    <ArrowRight className="h-4 w-4" />
                    Making choice...
                </>
                ): null}
            </div>
        </div>
    )
}
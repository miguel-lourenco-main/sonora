"use client";

import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@kit/ui/lib";
import { buttonStyles } from "@kit/ui/shadcn/button";

export default function ChoiceStatus({
    isProcessing,
    isCapturing,
    isMakingChoice,
}: {
    isProcessing: boolean;
    isCapturing: boolean;
    isMakingChoice: boolean;
}) {
    const state = isProcessing
        ? "processing"
        : isCapturing
          ? "capturing"
          : isMakingChoice
            ? "making"
            : "idle";

    return (
        <div className="flex flex-col items-center gap-2">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={state}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
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
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

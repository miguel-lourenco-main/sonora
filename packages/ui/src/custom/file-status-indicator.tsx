import { Check, CheckCircle, Loader2, X, XCircle } from "lucide-react";
import { cn } from "../lib";

interface StatusIndicatorProps {
  id?: string;
  status?: "uploading" | "uploaded" | "client" | "error";
  className?: string;
}

const size = "size-full";

export function StatusIndicator({ id, status, className }: StatusIndicatorProps) {
  return (
    <div className={cn(
      "absolute top-0 right-6 size-4 rounded-full flex items-center justify-center",
      "text-white",
      className
    )}>
      {id && status === "uploaded" ? (
        <CheckCircle className={`${size} text-green-500`} />
      ) : status === "uploading" ? (
        <Loader2 className={`${size} animate-spin text-blue-500`} />
      ) : status === "error" ? (
        <XCircle className={`${size} text-red-500`} />
      ) : (
        <div className={`${size} border border-gray-800 bg-gray-700 rounded-full`} />
      )}
    </div>
  );
} 
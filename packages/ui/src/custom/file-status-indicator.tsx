import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { cn } from "../lib";

/**
 * Props interface for the StatusIndicator component
 */
interface StatusIndicatorProps {
  id?: string;                   // Optional file ID
  status?: "uploading" | "uploaded" | "client" | "error";  // File status
  className?: string;            // Optional additional CSS classes
}

// Constant for consistent icon sizing
const size = "size-full";

/**
 * StatusIndicator Component
 * Displays a visual indicator for file status (upload progress, success, error)
 * 
 * Status Types:
 * - uploaded: Shows a green checkmark
 * - uploading: Shows a blue spinning loader
 * - error: Shows a red X
 * - default/client: Shows a gray circle
 * 
 * @param id - Optional file ID
 * @param status - Current status of the file
 * @param className - Optional CSS classes for styling
 */
export function StatusIndicator({ id, status, className }: StatusIndicatorProps) {
  return (
    <div className={cn(
      // Base styles for the indicator container
      "absolute top-0 right-6 size-4 rounded-full flex items-center justify-center",
      "text-white",
      className
    )}>
      {/* Render appropriate icon based on status */}
      {id && status === "uploaded" ? (
        <CheckCircle className={`${size} text-green-500`} />
      ) : status === "uploading" ? (
        <Loader2 className={`${size} animate-spin text-blue-500`} />
      ) : status === "error" ? (
        <XCircle className={`${size} text-red-500`} />
      ) : (
        // Default state (client-side or no status)
        <div className={`${size} border border-gray-800 bg-gray-700 rounded-full`} />
      )}
    </div>
  );
} 
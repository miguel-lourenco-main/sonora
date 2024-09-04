import { I18nComponent } from "@kit/i18n";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils";

export default function LoadingPDF(
  {
    className,
  }: {
    className?: string;
  }
) {
  return (
    <div className={cn("flex flex-col size-full justify-center items-center text-foreground", className)}>
      <I18nComponent i18nKey="ui:loadingPDF" />
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}
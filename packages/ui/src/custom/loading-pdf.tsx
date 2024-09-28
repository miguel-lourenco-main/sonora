import { I18nComponent } from "@kit/i18n";
import { Loader, Loader2 } from "lucide-react";
import { cn } from "../utils";

export default function LoadingPDF(
  {
    className,
    label
  }: {
    className?: string;
    label?: string;
  }
) {

  return (
    <div className={cn("flex flex-col size-full justify-center items-center text-foreground space-y-3", className)}>
      {label ? <span>{label}</span> : <I18nComponent i18nKey="ui:loadingPDF" />}
      <Loader className="size-5 animate-spin" />
    </div>
  );
}
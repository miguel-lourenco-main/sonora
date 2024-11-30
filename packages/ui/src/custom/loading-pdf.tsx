import I18nComponent from "@kit/ui/i18n-component"

;
import { Loader } from "lucide-react";
import { cn } from "../lib";

export default function LoadingDocument(
  {
    className,
    label
  }: {
    className?: string;
    label?: string;
  }
) {

  return (
    <div className={cn("flex flex-col size-full justify-center items-center text-foreground gap-y-3", className)}>
      {label ? <span>{label}</span> : <I18nComponent i18nKey="ui:loadingDocument" />}
      <Loader className="size-5 animate-spin" />
    </div>
  );
}
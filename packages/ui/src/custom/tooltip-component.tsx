import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../shadcn/tooltip";
import { cn } from "../lib";

export default function TooltipComponent({ trigger, content, className }: { 
  trigger: React.ReactNode, 
  content: React.ReactNode, 
  className?: string 
}){
  return (
    <div className="contents isolate">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="w-fit">
              {trigger}
          </TooltipTrigger>
          <TooltipContent className={cn("z-50", className)}>
              {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
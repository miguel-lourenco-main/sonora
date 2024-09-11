import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../shadcn/tooltip";

export default function TooltipComponent({ trigger, content, className }: { trigger: React.ReactNode, content: React.ReactNode, className?: string }){
    return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
                {trigger}
            </TooltipTrigger>
            <TooltipContent className={className}>
                {content}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
}
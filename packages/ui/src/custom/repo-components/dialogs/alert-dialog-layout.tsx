import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../shadcn/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../shadcn/tooltip';


export function AlertDialogContentLayout({
  footer,
  children,
  title,
  description,
}: {
  footer: () => JSX.Element;
  children?: React.ReactNode;
  title?: string;
  description?: string;
}) {

  return (
    <AlertDialogContent>
      {(title || description) && (
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {description && (
            <AlertDialogDescription className="text-center">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
      )}
      {children}
      <AlertDialogFooter>{footer()}</AlertDialogFooter>
    </AlertDialogContent>
  );
}

export function AlertDialogWTriggerLayout({
  footer,
  children,
  title,
  description,
  tooltip,
  reset = () => {},
  trigger = () => <></>,
}: {
  footer: () => JSX.Element;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  tooltip?: string;
  reset?: () => void;
  trigger?: () => JSX.Element;
}) {

  return (
    <AlertDialog onOpenChange={(open) => !open && reset ? reset() : {}}>
      <AlertDialogTrigger asChild>
        <div className='size-full'>
          {tooltip ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {trigger()}
                </TooltipTrigger>
                <TooltipContent className="bg-muted">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            trigger()
          )}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContentLayout
        footer={footer}
        description={description}
        title={title}
      >
        {children}
      </AlertDialogContentLayout>
    </AlertDialog>
  );
}

export function AlertDialogWSetOpenLayout({
  footer,
  children,
  title,
  description,
  tooltip,
  openModal = false,
  reset = () => {},
  setOpen = () => {},
}: {
  footer: () => JSX.Element;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  tooltip?: string;
  openModal?: boolean;
  reset?: () => void;
  setOpen?: (open: boolean) => void;
}) {
  
  function onOpenChange(open: boolean) {
    setOpen(open);

    if (!open) reset();
  }

  return (
    <AlertDialog open onOpenChange={(open) => onOpenChange(open)}>
      <AlertDialogContentLayout
        footer={footer}
        children={children}
        description={description}
        title={title}
      />
    </AlertDialog>
  );
}

export function DeleteDialogLayout({
  footer,
  children,
  title,
  open,
  description,
  label,
  tooltip,
  reset = () => {},
  setOpen = () => {},
  trigger = () => <></>,
}: {
  footer: () => JSX.Element;
  children?: React.ReactNode;
  title?: string;
  open?: boolean;
  description?: string;
  label?: string;
  tooltip?: string;
  reset?: () => void;
  setOpen?: (open: boolean) => void;
  trigger?: () => JSX.Element;
}) {
  const descript = description ??
    `This action cannot be undone. This will permanently delete ${label ? `the ${label} that were selected` : 'the selected items'} and remove the data from the server.`;

  if(trigger){
    return (
      <AlertDialogWTriggerLayout
        footer={footer}
        title={title}
        reset={reset}
        trigger={trigger}
        description={descript}
        tooltip={tooltip}
      >
        {children}
      </AlertDialogWTriggerLayout>
    )
  }else{
    return (
      <AlertDialogWSetOpenLayout
        footer={footer}
        title={title}
        reset={reset}
        openModal={open}
        setOpen={setOpen}
        description={descript}
        tooltip={tooltip}
      >
        {children}
      </AlertDialogWSetOpenLayout>
    );
  }
}
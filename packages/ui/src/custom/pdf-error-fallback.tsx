// packages/ui/src/custom/pdf-error-fallback.tsx
import { AlertCircle } from 'lucide-react';
import { Button } from '../shadcn/button';
import { Alert, AlertDescription, AlertTitle } from '../shadcn/alert';
import { Trans } from '../makerkit/trans';

interface PDFErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function PDFErrorFallback({ error, resetErrorBoundary }: PDFErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4 h-full">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          <Trans i18nKey="common:errorLoadingPDF" />
        </AlertTitle>
        <AlertDescription>
          <Trans i18nKey="common:errorLoadingPDFDescription" />
        </AlertDescription>
      </Alert>
      
      <Button variant="outline" onClick={resetErrorBoundary}>
        <Trans i18nKey="common:retry" />
      </Button>
    </div>
  );
}
import * as React from 'react';
import { Button } from '@kit/ui/shadcn/button';
import { Plus } from 'lucide-react';

export interface HomeAddAccountButtonProps {
  onClick?: () => void;
  className?: string;
}

export function HomeAddAccountButton({ onClick, className }: HomeAddAccountButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={className}
      variant="outline"
      size="sm"
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Account
    </Button>
  );
}

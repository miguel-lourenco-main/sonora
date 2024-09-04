import { LucideIcon } from "lucide-react";

export interface Filter {
  id: string;
  title: string;
  options: {
      value: string;
      label: string;
      icon: LucideIcon;
  }[];
}

export interface DataTableActions {
  name:string
  exec: () => void
  customItem: (() => JSX.Element) | null
}
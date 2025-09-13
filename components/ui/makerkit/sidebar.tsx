import { z } from 'zod';

export const SidebarConfigSchema = z.object({
  style: z.enum(['custom', 'sidebar', 'header']).default('sidebar'),
  sidebarCollapsed: z
    .enum(['false', 'true'])
    .default('false')
    .optional()
    .transform((value) => value === `true`),
  routes: z.array(z.any()),
});

export type SidebarConfig = z.infer<typeof SidebarConfigSchema>;

export interface SidebarRoute {
  label: string;
  path: string;
  Icon?: React.ReactNode;
  end?: boolean | ((path: string) => boolean);
  children?: SidebarRoute[];
  collapsible?: boolean;
  collapsed?: boolean;
  renderAction?: React.ReactNode;
}

export interface SidebarGroup {
  label: string;
  collapsible?: boolean;
  collapsed?: boolean;
  children: SidebarRoute[];
  renderAction?: React.ReactNode;
}

export interface SidebarDivider {
  divider: true;
}

export type SidebarConfigItem = SidebarGroup | SidebarDivider;

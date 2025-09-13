import { z } from 'zod';
import { Home, Volume2, Settings } from 'lucide-react';
import { NavigationConfigSchema } from '@kit/ui/makerkit/navigation-config.schema';

const routes = [
  {
    label: 'Navigation',
    children: [
      { label: 'Stories', path: '/', Icon: <Home /> },
      { label: 'Voices', path: '/voices', Icon: <Volume2 /> },
    ],
  },
] satisfies z.infer<typeof NavigationConfigSchema>['routes'];

export const personalAccountNavigationConfig = NavigationConfigSchema.parse({
  routes,
  style: 'sidebar',
  sidebarCollapsed: process.env.NEXT_PUBLIC_HOME_SIDEBAR_COLLAPSED,
});

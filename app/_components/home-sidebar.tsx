import { If } from '@kit/ui/makerkit/if';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarNavigation,
  SidebarProvider,
} from '@kit/ui/shadcn/sidebar';
import { cn } from '@kit/ui/lib';

import { AppLogo } from '~/components/app-logo';
import { ProfileAccountDropdownContainer } from '~/components/personal-account-dropdown-container';
import featuresFlagConfig from '~/config/feature-flags.config';
import { personalAccountNavigationConfig } from '~/config/personal-account-navigation.config';
import { UserNotifications } from '~/app/_components/user-notifications';

// home imports
import { HomeAccountSelector } from './home-account-selector';
import { ModeToggle } from '@kit/ui/makerkit/mode-toggle';

interface HomeSidebarProps {
}

const minimized = personalAccountNavigationConfig.sidebarCollapsed;

export function HomeSidebar(props: HomeSidebarProps) {

  return (
    <SidebarProvider minimized={minimized}>
      <Sidebar>
        <SidebarHeader className={'h-16 justify-center'}>
          <div className={'flex items-center justify-between space-x-2'}>
            <AppLogo />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarNavigation config={personalAccountNavigationConfig} />
        </SidebarContent>

        <SidebarFooter>
          <ModeToggle />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}

'use client';

import { useContext, useEffect, useId, useRef, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';
import { z } from 'zod';

import { cn, isRouteActive } from '../lib/utils';
import { Button } from '../shadcn/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../shadcn/tooltip';
import { SidebarContext } from './context/sidebar.context';
import { If } from './if';
import type { NavigationConfigSchema } from './navigation-config.schema';
import { Trans } from './trans';

import { checkCollapseSidebar } from "@kit/shared/utils"

export type SidebarConfig = z.infer<typeof NavigationConfigSchema>;

export { SidebarContext };

export function Sidebar(props: {
  collapsed?: boolean;
  expandOnHover?: boolean;
  className?: string;
  children:
    | React.ReactNode
    | ((props: {
        collapsed: boolean;
        setCollapsed: (collapsed: boolean) => void;
      }) => React.ReactNode);
}) {
  const [collapsed, setCollapsed] = useState(props.collapsed ?? false);
  const isExpandedRef = useRef<boolean>(false);

  const expandOnHover =
    props.expandOnHover ??
    process.env.NEXT_PUBLIC_EXPAND_SIDEBAR_ON_HOVER === 'true';

  const sidebarSizeClassName = getSidebarSizeClassName(
    collapsed,
    isExpandedRef.current,
  );

  const className = getClassNameBuilder(
    cn(props.className ?? '', sidebarSizeClassName, {}),
  )();

  const containerClassName = cn(sidebarSizeClassName, 'bg-inherit', {
    'max-w-[4rem]': expandOnHover && isExpandedRef.current,
  });

  const ctx = { collapsed, setCollapsed };

  const currentPath = usePathname()

  const mouseEnterSidebar = () => {
    if(checkCollapseSidebar(currentPath)) setCollapsed(false)
  }

  const mouseLeaveSidebar = () => {
    if(checkCollapseSidebar(currentPath)) setCollapsed(true)
  }

  useEffect(() => {
    if(checkCollapseSidebar(currentPath)){
      setCollapsed(true)
    }else{
      setCollapsed(false)
    }

  }, [currentPath])

  return (
    <SidebarContext.Provider value={ctx}>
      <div className={className} onMouseEnter={mouseEnterSidebar} onMouseLeave={mouseLeaveSidebar}>
        {typeof props.children === 'function'
          ? props.children(ctx)
          : props.children}
      </div>
    </SidebarContext.Provider>
  );
}

export function SidebarContent({
  children,
  className: customClassName,
}: React.PropsWithChildren<{
  className?: string;
}>) {
  const { collapsed } = useContext(SidebarContext);

  const className = cn(
    'flex w-full flex-col space-y-1.5 py-1',
    customClassName,
    {
      'px-4': !collapsed,
      'px-2': collapsed,
    },
  );

  return <div className={className}>{children}</div>;
}

export function SidebarGroup({
  label,
  collapsed = false,
  collapsible = true,
  children,
}: React.PropsWithChildren<{
  label: string | React.ReactNode;
  collapsible?: boolean;
  collapsed?: boolean;
}>) {
  const { collapsed: sidebarCollapsed } = useContext(SidebarContext);
  const [isGroupCollapsed, setIsGroupCollapsed] = useState(collapsed);
  const id = useId();

  const Title = (props: React.PropsWithChildren) => {
    if (sidebarCollapsed) {
      return null;
    }

    return (
      <span className={'text-xs font-semibold uppercase text-muted-foreground'}>
        {props.children}
      </span>
    );
  };

  const Wrapper = () => {
    const className = cn(
      'px-container group flex items-center justify-between space-x-2.5',
      {
        'py-2.5': !sidebarCollapsed,
      },
    );

    if (collapsible) {
      return (
        <button
          aria-expanded={!isGroupCollapsed}
          aria-controls={id}
          onClick={() => setIsGroupCollapsed(!isGroupCollapsed)}
          className={className}
        >
          <Title>{label}</Title>

          <If condition={collapsible}>
            <ChevronDown
              className={cn(`h-3 transition duration-300`, {
                'rotate-180': !isGroupCollapsed,
              })}
            />
          </If>
        </button>
      );
    }

    return (
      <div className={className}>
        <Title>{label}</Title>
      </div>
    );
  };

  return (
    <div
      className={cn('flex flex-col', {
        'space-y-1 py-1': !collapsed,
      })}
    >
      <Wrapper />

      <If condition={collapsible ? !isGroupCollapsed : true}>
        <div id={id} className={'flex flex-col space-y-1.5'}>
          {children}
        </div>
      </If>
    </div>
  );
}

export function SidebarDivider() {
  return (
    <div className={'dark:border-dark-800 my-2 border-t border-gray-100'} />
  );
}

export function SidebarItem({
  end,
  path,
  children,
  Icon,
}: React.PropsWithChildren<{
  path: string;
  Icon: React.ReactNode;
  end?: boolean | ((path: string) => boolean);
}>) {
  const { collapsed } = useContext(SidebarContext);
  const currentPath = usePathname() ?? '';

  const active = isRouteActive(path, currentPath, end ?? false);
  const variant = active ? 'secondary' : 'ghost';

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
          <Button
            asChild
            className={cn(
              'flex w-full text-sm shadow-none active:bg-secondary/60',
              {
                'justify-start space-x-2.5': !collapsed,
                'hover:bg-initial': active,
              },
            )}
            size={'sm'}
            variant={variant}
          >
            <Link href={path}>
              {Icon}
              <span
                className={cn('w-auto transition-opacity duration-300', {
                  'w-0 opacity-0': collapsed,
                })}
              >
                {children}
              </span>
            </Link>
          </Button>
        </TooltipTrigger>

        <If condition={collapsed}>
          <TooltipContent side={'right'} sideOffset={10}>
            {children}
          </TooltipContent>
        </If>
      </Tooltip>
    </TooltipProvider>
  );
}

function getClassNameBuilder(className: string) {
  return cva([cn('flex box-content ease-in-out duration-300 h-screen flex-col relative', className)], {
    variants: {
      collapsed: {
        true: `w-[5.5rem]`,
        false: `w-2/12 lg:w-[17rem]`,
      },
    },
  });
}

export function SidebarNavigation({
  config,
}: React.PropsWithChildren<{
  config: SidebarConfig;
}>) {
  return (
    <>
      {config.routes.map((item, index) => {
        if ('divider' in item) {
          return <SidebarDivider key={index} />;
        }

        if ('children' in item) {
          return (
            <SidebarGroup
              key={item.label}
              label={<Trans i18nKey={item.label} defaults={item.label} />}
              collapsible={item.collapsible}
              collapsed={item.collapsed}
            >
              {item.children.map((child) => {
                return (
                  <SidebarItem
                    key={child.path}
                    end={child.end}
                    path={child.path}
                    Icon={child.Icon}
                  >
                    <Trans i18nKey={child.label} defaults={child.label} />
                  </SidebarItem>
                );
              })}
            </SidebarGroup>
          );
        }

        return (
          <SidebarItem
            key={item.path}
            end={item.end}
            path={item.path}
            Icon={item.Icon}
          >
            <Trans i18nKey={item.label} defaults={item.label} />
          </SidebarItem>
        );
      })}
    </>
  );
}

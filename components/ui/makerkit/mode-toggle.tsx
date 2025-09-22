'use client';

import { useMemo } from 'react';

import { Computer, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '../lib';
import { Button, buttonVariants } from '../shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../shadcn/dropdown-menu';
import { Trans } from './trans';

const MODES = ['light', 'dark', 'system'];

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ModeToggleProps = {
  className?: string;
  variant?: ButtonVariantProps['variant'];
  size?: ButtonVariantProps['size'];
  shape?: ButtonVariantProps['shape'];
  srLabel?: string;
};

export function ModeToggle(props: ModeToggleProps) {
  const { setTheme, theme } = useTheme();
  const {
    className,
    variant = 'ghost',
    size = 'icon',
    shape,
    srLabel = 'Toggle theme',
  } = props;

  const Items = useMemo(() => {
    return MODES.map((mode) => {
      const isSelected = theme === mode;

      return (
        <DropdownMenuItem
          className={cn('space-x-2 text-lg', {
            'bg-muted': isSelected,
          })}
          key={mode}
          onClick={() => {
            setTheme(mode);
            setCookieTheme(mode);
          }}
        >
          <Icon theme={mode} />

          <span>
            <Trans i18nKey={`common:${mode}Theme`} />
          </span>
        </DropdownMenuItem>
      );
    });
  }, [setTheme, theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} shape={shape} className={className} aria-label={srLabel}>
          <Sun className="size-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{srLabel}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">{Items}</DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SubMenuModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();

  const MenuItems = useMemo(
    () =>
      MODES.map((mode) => {
        const isSelected = theme === mode;

        return (
          <DropdownMenuItem
            className={cn('flex items-center space-x-2', {
              'bg-muted': isSelected,
            })}
            key={mode}
            onClick={() => {
              setTheme(mode);
              setCookieTheme(mode);
            }}
          >
            <Icon theme={mode} />

            <span className="text-xl">
              <Trans i18nKey={`common:${mode}Theme`} />
            </span>
          </DropdownMenuItem>
        );
      }),
    [setTheme, theme],
  );

  return (
    <>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger
          className={
            'hidden w-full items-center justify-between space-x-2 lg:flex'
          }
        >
          <span className={'flex space-x-2'}>
            <Icon theme={resolvedTheme} />

            <span>
              <Trans i18nKey={'common:theme'} />
            </span>
          </span>
        </DropdownMenuSubTrigger>

        <DropdownMenuSubContent>{MenuItems}</DropdownMenuSubContent>
      </DropdownMenuSub>

      <div className={'lg:hidden'}>
        <DropdownMenuLabel>
          <Trans i18nKey={'common:theme'} />
        </DropdownMenuLabel>

        {MenuItems}
      </div>
    </>
  );
}

function setCookieTheme(theme: string) {
  document.cookie = `theme=${theme}; path=/; max-age=31536000`;
}

function Icon({ theme }: { theme: string | undefined }) {
  switch (theme) {
    case 'light':
      return <Sun className="size-5" />;
    case 'dark':
      return <Moon className="size-5" />;
    case 'system':
      return <Computer className="size-5" />;
  }
}

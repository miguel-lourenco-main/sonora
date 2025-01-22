'use client'

import { getSupabaseBrowserClient } from "@kit/supabase/browser-client";
import { Database } from "@kit/supabase/database";
import { Progress } from "@kit/ui/progress";
import { cn } from '@kit/ui/lib';
import { useEffect, useState } from "react";

type UserTokens = {
  account_id: string;
  credits: number;
  monthly_credits: number;
}

type CurrentPagesProps = {
  size?: 'small' | 'normal' | 'large'
  collapsed?: boolean
}

const sizeStyles = {
  small: {
    container: 'w-full',
    value: 'text-lg',
    label: 'text-xs',
    progress: 'h-[0.5rem]'
  },
  normal: {
    container: 'w-[30rem]',
    value: 'text-2xl',
    label: 'text-sm',
    progress: 'h-[0.75rem]'
  },
  large: {
    container: 'w-[40rem]',
    value: 'text-3xl',
    label: 'text-sm',
    progress: 'h-[1rem]'
  }
} as const;

export default function CurrentPages({ size = 'normal', collapsed = false }: CurrentPagesProps) {

  const [tokens, setTokens] = useState<number>(0);
  const [monthlyTokens, setMonthlyTokens] = useState<number>(1);

  const handleCreditsChange = (userTokens: UserTokens) => {
    console.log('new userTokens', userTokens);

    setTokens(userTokens.credits);
    setMonthlyTokens(userTokens.monthly_credits);
  }

  // Function to fetch credits
  const fetchCredits = async (mounted: boolean) => {
    try {
      const client = getSupabaseBrowserClient<Database>();
      const { data: { session } } = await client.auth.getSession();
      const accountId = session?.user.id;
      
      if (!accountId || !mounted) return;

      const { data } = await client.from('credit')
        .select('*')
        .filter('account_id', 'eq', accountId)
        .single();

      if (mounted) {
        setTokens(data?.credits ?? 0);
        setMonthlyTokens(data?.monthly_credits ?? 1);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    void fetchCredits(mounted);
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const subscribeChanges = async () => {
      try {
        const client = getSupabaseBrowserClient<Database>();
        const { data: { session } } = await client.auth.getSession();
        const accountId = session?.user.id;
        
        if (!accountId || !mounted) return;

        // Use a stable channel name based on user ID to prevent duplicate subscriptions
        const channelName = `credit-${accountId}`;
        
        // Unsubscribe from any existing subscription first
        const existingChannel = client.getChannels().find(ch => ch.topic === channelName);
        if (existingChannel) {
          await existingChannel.unsubscribe();
        }

        const channel = client.channel(channelName)
          .on(
            'postgres_changes',
            { 
              event: '*', 
              schema: 'public', 
              table: 'credit', 
              filter: `account_id=eq.${accountId}` 
            },
            (payload) => {
              if (mounted) {
                const newData = payload.new as UserTokens;
                handleCreditsChange(newData);
                
                // Force a fresh fetch to ensure consistency
                void fetchCredits(mounted);
              }
            }
          )
          .subscribe((status) => {
            console.debug('Credit subscription status:', status);
          });

        return () => {
          void channel.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up credit subscription:', error);
      }
    };

    const subscription = subscribeChanges();

    return () => {
      mounted = false;
      void subscription.then(cleanup => cleanup?.());
    };
  }, []);

  const styles = sizeStyles[size];

  return (
    <>
      {collapsed ? (
        <p className={cn(tokens.toString().length > 3 && 'text-xs')}>{tokens}</p>
      ):(
        <div className={`flex flex-col space-y-2 ${styles.container}`}>
          <div className="flex space-x-2">
            <div 
              data-test={'polydoc-current-pages-left'} 
              className={`${styles.value} text-foreground font-semibold`}
            >
              {tokens}
            </div>
            <p className={`${styles.label} mb-1 -mr-1 h-fit self-end text-muted-foreground`}>/</p>
            <div 
              data-test={'polydoc-current-pages-monthly'} 
              className={`${styles.label} mb-1 h-fit self-end text-muted-foreground`}
            >
              {monthlyTokens}
            </div>
            <p className={`${styles.label} mb-1 -mr-1 h-fit self-end text-muted-foreground`}>
              tokens left
            </p>
          </div>
          <Progress 
            className={styles.progress} 
            value={tokens > monthlyTokens ? 100 : (tokens/monthlyTokens) * 100} 
            max={monthlyTokens} 
          />
        </div>
      )}
    </>
  );
}

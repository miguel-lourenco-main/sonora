'use client'

import { getSupabaseBrowserClient } from "@kit/supabase/browser-client";
import { Progress } from "@kit/ui/progress";
import { useEffect, useState } from "react";

type UserTokens = {
  account_id: string;
  credits: number;
  monthly_credits: number;
}

type CurrentPagesProps = {
  size?: 'small' | 'normal' | 'large'
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

export default function CurrentPages({ size = 'normal' }: CurrentPagesProps) {

    const [tokens, setTokens] = useState<number>(0);
    const [monthlyTokens, setMonthlyTokens] = useState<number>(1);

    const handleCreditsChange = (userTokens: UserTokens) => {
      console.log('new userTokens', userTokens);

      setTokens(userTokens.credits);
      setMonthlyTokens(userTokens.monthly_credits);
    }

    useEffect(() => {

      const setupCredits = async () => {
        const client = getSupabaseBrowserClient();

        const { data: { session } } = await client.auth.getSession();
        const accountId = session?.user.id;
        const { data } = await client.from('credit').select('*').filter('account_id', 'eq', accountId);

        setTokens(data?.[0]?.credits ?? 0);
        setMonthlyTokens(data?.[0]?.monthly_credits ?? 1);
      }

      setupCredits();
    }, []);

    useEffect(() => {
      const subscribeChanges = async () => {
        const client = getSupabaseBrowserClient();
        const { data: { session } } = await client.auth.getSession();
        const accountId = session?.user.id;
        
        const channelName = `credit-${Math.random().toString(36).slice(2, 9)}`;
        const channel = client.channel(channelName)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'credit', filter: `account_id=eq.${accountId}` },
            (payload) => handleCreditsChange(payload.new as UserTokens)
          )
          .subscribe()

        // Return cleanup function
        return () => {
          channel.unsubscribe();
        };
      };

      const subscription = subscribeChanges();
      
      // Cleanup on unmount
      return () => {
        subscription.then(cleanup => cleanup?.());
      };
    }, []);

    const styles = sizeStyles[size];

    return (
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
    );
}

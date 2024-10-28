'use client'

import { getSupabaseBrowserClient } from "@kit/supabase/browser-client";
import { Progress } from "@kit/ui/progress";
import { useEffect, useState } from "react";

type UserTokens = {
  account_id: string;
  credits: number;
  monthly_credits: number;
}

export default function CurrentPages() {

    const [tokens, setTokens] = useState<number>(0);
    const [monthlyTokens, setMonthlyTokens] = useState<number>(1);

    const handleCreditsChange = (userTokens: UserTokens) => {
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
        setMonthlyTokens(data?.[0]?.monthly_credits ?? 0);
      }

      setupCredits();
    }, []);

    useEffect(() => {
        const subscribeChanges = async () => {
          const client = getSupabaseBrowserClient();

          const { data: { session } } = await client.auth.getSession();
          const accountId = session?.user.id;
          
          client.channel('credit')
            .on(
              'postgres_changes',
              { event: '*', schema: 'public', table: 'credit', filter: `account_id=eq.${accountId}` },
              (payload) => handleCreditsChange(payload.new as UserTokens)
            )
            .subscribe()
        };
    
        subscribeChanges();
      }, []);

  return (
    <div className="flex w-[30rem] flex-col space-y-2">
        <div className="flex space-x-2">
            <div data-test={'polydoc-current-pages-left'} className="text-3xl text-foreground font-semibold">{tokens}</div>
            <p className="text-sm mb-1 -mr-1 h-fit self-end text-muted-foreground">/</p>
            <div data-test={'polydoc-current-pages-monthly'} className="text-sm mb-1 h-fit self-end text-muted-foreground">{monthlyTokens}</div>
            <p className="text-sm mb-1 -mr-1 h-fit self-end text-muted-foreground">tokens left</p>
        </div>
        <Progress className='h-[1rem]' value={tokens > monthlyTokens ? 100 : (tokens/monthlyTokens) * 100} max={monthlyTokens} />
    </div>
  );
}

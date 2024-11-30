/**
 * -------------------------------------------------------
 * Section: Credit
 * Credits an account has.
 * -------------------------------------------------------
 */

create table if not exists public.credit (
  account_id uuid references public.accounts (id) on delete cascade not null default auth.uid() primary key,
  credits int not null default 0,
  monthly_credits int not null default 0
);

comment on table public.credit is 'The credits an account has';
comment on column public.credit.account_id is 'The account the credit belongs to';
comment on column public.credit.credits is 'The number of credits the account has';
comment on column public.credit.monthly_credits is 'The number of credits the account has for the current month';
-- enable realtime
alter publication supabase_realtime
add table public.credit;

-- Indexes on the credit table
create index ix_credit_account_id on public.credit (account_id);

-- Enable RLS with corresponding policies
SELECT rls_configure(
  table_name => 'credit',
  create_select => true,
  create_insert => false,
  create_update => false,
  create_delete => false
);

-- Function to decrement credits when a run's credits field is updated or inserted
create or replace function public.credit_decrement_on_run_update()
returns trigger 
set search_path = ''  -- Security best practice: set empty search path
as $$
begin
    -- For UPDATE: proceed if credits field is being updated from null to non-null
    -- For INSERT: proceed if credits field is not null
    if (TG_OP = 'UPDATE' and NEW.credits is not null and OLD.credits is null) or
       (TG_OP = 'INSERT' and NEW.credits is not null) then
        -- Decrement credits from the credit table
        update public.credit
        set credits = credits - NEW.credits
        where account_id = NEW.account_id;
    end if;
    return NEW;
end;
$$ language plpgsql;

-- Create new trigger to run the function on both insert and update of runs table
create or replace trigger credit_decrement_on_run_update_trigger
    after insert or update of credits
    on public.run
    for each row
    execute function public.credit_decrement_on_run_update();

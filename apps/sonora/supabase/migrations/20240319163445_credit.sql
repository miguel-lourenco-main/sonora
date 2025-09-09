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

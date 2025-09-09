/**
 * -------------------------------------------------------
 * Section: Voice
 * -------------------------------------------------------
 */

-- Create the voice table
create table if not exists public.voice (
    id uuid unique not null primary key default extensions.uuid_generate_v4(),
    account_id uuid references public.accounts (id) on delete cascade not null default auth.uid(),
    created_at timestamptz not null default current_timestamp,
    is_default boolean not null default false,
    name varchar(255) not null,
    voice_id varchar(255) not null,
    is_public boolean not null default false
);

-- Add comments to the table and columns
comment on table public.voice is 'The voices available for a user';
comment on column public.voice.id is 'The unique identifier for the voice';
comment on column public.voice.account_id is 'The account the voice belongs to';
comment on column public.voice.created_at is 'The timestamp when the voice was created';
comment on column public.voice.is_default is 'Whether this voice is the default voice for the account';
comment on column public.voice.name is 'The name of the voice';
comment on column public.voice.voice_id is 'The ElevenLabs ID of the voice';
comment on column public.voice.is_public is 'Whether this voice is accessible by all accounts';

-- enable realtime
alter publication supabase_realtime
add table public.voice;

-- Indexes on the voice table
create index ix_voice_id on public.voice (id);

-- Enable RLS
alter table public.voice enable row level security;

-- Create policies

-- Read policy: Allow reading public voices or voices owned by the user
create policy "Read public voices or own voices"
  on public.voice
  for select
  using (
    is_public = true 
    or account_id = auth.uid()
  );

-- Insert policy: Allow users to create voices for their own account
create policy "Users can create voices"
  on public.voice
  for insert
  with check (
    account_id = auth.uid()
  );

-- Update policy: Allow users to update their own voices
create policy "Users can update own voices"
  on public.voice
  for update
  using (
    account_id = auth.uid()
  );

-- Delete policy: Allow users to delete their own voices
create policy "Users can delete own voices"
  on public.voice
  for delete
  using (
    account_id = auth.uid()
  );
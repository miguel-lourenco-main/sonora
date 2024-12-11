import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

import { createAuthCallbackService } from '@kit/supabase/auth';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import pathsConfig from '~/config/paths.config';
import { Database } from '~/lib/database.types';

export async function GET(request: NextRequest) {
  const service = createAuthCallbackService(getSupabaseServerClient<Database>());

  const { nextPath } = await service.exchangeCodeForSession(request, {
    joinTeamPath: pathsConfig.app.joinTeam,
    redirectPath: pathsConfig.app.app,
  });

  return redirect(nextPath);
}

export const runtime = 'edge'
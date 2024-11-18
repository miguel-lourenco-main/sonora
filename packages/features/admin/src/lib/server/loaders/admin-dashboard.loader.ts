import 'server-only';

import { cache } from 'react';

import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import { createAdminDashboardService } from '../services/admin-dashboard.service';
import { Database } from '@kit/supabase/database';

/**
 * @name loadAdminDashboard
 * @description Load the admin dashboard data.
 * @param params
 */
export const loadAdminDashboard = cache(adminDashboardLoader);

function adminDashboardLoader() {
  const client = getSupabaseServerAdminClient<Database>();
  const service = createAdminDashboardService(client);

  return service.getDashboardData();
}

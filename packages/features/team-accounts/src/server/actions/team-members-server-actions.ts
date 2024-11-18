'use server';

import { revalidatePath } from 'next/cache';

import { enhanceAction } from '@kit/next/actions';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { RemoveMemberSchema } from '../../schema/remove-member.schema';
import { TransferOwnershipConfirmationSchema } from '../../schema/transfer-ownership-confirmation.schema';
import { UpdateMemberRoleSchema } from '../../schema/update-member-role.schema';
import { createAccountMembersService } from '../services/account-members.service';
import { Database } from '@kit/supabase/database';

/**
 * @name removeMemberFromAccountAction
 * @description Removes a member from an account.
 */
export const removeMemberFromAccountAction = enhanceAction(
  async ({ accountId, userId }) => {
    const client = getSupabaseServerClient<Database>();
    const service = createAccountMembersService(client);

    await service.removeMemberFromAccount({
      accountId,
      userId,
    });

    // revalidate all pages that depend on the account
    revalidatePath('/app/[account]', 'layout');

    return { success: true };
  },
  {
    schema: RemoveMemberSchema,
  },
);

/**
 * @name updateMemberRoleAction
 * @description Updates the role of a member in an account.
 */
export const updateMemberRoleAction = enhanceAction(
  async (data) => {
    const client = getSupabaseServerClient<Database>();
    const service = createAccountMembersService(client);
    const adminClient = getSupabaseServerAdminClient<Database>();

    // update the role of the member
    await service.updateMemberRole(data, adminClient);

    // revalidate all pages that depend on the account
    revalidatePath('/app/[account]', 'layout');

    return { success: true };
  },
  {
    schema: UpdateMemberRoleSchema,
  },
);

/**
 * @name transferOwnershipAction
 * @description Transfers the ownership of an account to another member.
 */
export const transferOwnershipAction = enhanceAction(
  async (data) => {
    const client = getSupabaseServerClient<Database>();

    // assert that the user is the owner of the account
    const { data: isOwner, error } = await client.rpc('is_account_owner', {
      account_id: data.accountId,
    });

    if (error ?? !isOwner) {
      throw new Error(
        `You must be the owner of the account to transfer ownership`,
      );
    }

    const service = createAccountMembersService(client);

    // at this point, the user is authenticated and is the owner of the account
    // so we proceed with the transfer of ownership with admin privileges
    const adminClient = getSupabaseServerAdminClient<Database>();

    // transfer the ownership of the account
    await service.transferOwnership(data, adminClient);

    // revalidate all pages that depend on the account
    revalidatePath('/app/[account]', 'layout');

    return {
      success: true,
    };
  },
  {
    schema: TransferOwnershipConfirmationSchema,
  },
);

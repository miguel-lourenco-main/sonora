import { createJsonErrorResponseHandler } from '@kit/vercel-sdk-provider-utils';
import { z } from 'zod';

const edgenErrorDataSchema = z.object({
  object: z.literal('error'),
  message: z.string(),
  type: z.string(),
  param: z.string().nullable(),
  code: z.string().nullable(),
});

export type EdgenErrorData = z.infer<typeof edgenErrorDataSchema>;

export const edgenFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: edgenErrorDataSchema,
  errorToMessage: data => data.message,
});

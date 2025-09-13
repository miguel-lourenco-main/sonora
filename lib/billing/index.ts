import { z } from 'zod';

export const BillingProviderSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['stripe', 'paddle', 'lemonsqueezy']),
  config: z.record(z.any()),
});

const billingConfigSchema = z.object({
  provider: BillingProviderSchema,
  features: z.array(z.string()).optional(),
  limits: z.record(z.number()).optional(),
  products: z.array(z.any()).optional(),
});

export const createBillingSchema = (config: any) => billingConfigSchema.parse(config);

export type BillingProvider = z.infer<typeof BillingProviderSchema>;
export type CreateBillingConfig = z.infer<typeof billingConfigSchema>;

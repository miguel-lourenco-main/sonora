import { z } from 'zod';
import { BillingConfig, getProductPlanPair } from '@kit/billing';
import { useTranslation } from 'react-i18next';

export const getPolydocPlanPickerSchema = (config: BillingConfig) => {
  const { t } = useTranslation(`billing`);

  return (
    z.object({
      planId: z.string(),
      productId: z.string(),
      pageCount: z.number().optional(),
      interval: z.string().optional(),
    })
    .refine(
      (data) => {
        try {
          const { product, plan } = getProductPlanPair(
            config,
            data.planId,
          );

          return product && plan;
        } catch {
          return false;
        }
      },
      { message: t('noPlanChosen'), path: ['planId'] },
    )
  )
}

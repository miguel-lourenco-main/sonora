import { BillingConfig, getProductPlanPair } from "@kit/billing";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const getPlanPickerSchema = (config: BillingConfig) => {

    const { t } = useTranslation(`billing`);

    return(
        z.object({
            planId: z.string(),
            productId: z.string(),
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
            { message: t('noPlanChosen'), path: ['planId'] }
        )
    )
}
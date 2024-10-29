import { Separator } from "@kit/ui/separator";
import { Trans } from "@kit/ui/trans";
import { CheckCircle } from "lucide-react";
import { LineItemDetails } from "../line-item-details";
import { LineItemSchema } from "@kit/billing";
import { If } from '@kit/ui/if';
import { z } from "zod";


export function PlanDetails({
    selectedProduct,
    selectedInterval,
    selectedPlan,
  }: {
    selectedProduct: {
      id: string;
      name: string;
      description: string;
      currency: string;
      features: string[];
    };
  
    selectedInterval: string;
  
    selectedPlan: {
      lineItems: z.infer<typeof LineItemSchema>[];
      paymentType: string;
    };
  }) {
    const isRecurring = selectedPlan.paymentType === 'recurring';
  
    // trick to force animation on re-render
    const key = Math.random();
  
    return (
      <div
        key={key}
        className={
          'fade-in animate-in zoom-in-95 flex w-full flex-col space-y-4 py-2 lg:px-8'
        }
      >
        <div className={'flex flex-col space-y-0.5'}>
          <span className={'text-sm font-medium'}>
            <b>
              <Trans
                i18nKey={`billing:plans.${selectedProduct.id}.name`}
                defaults={selectedProduct.name}
              />
            </b>{' '}
            <If condition={isRecurring}>
              / <Trans i18nKey={`billing:billingInterval.${selectedInterval}`} />
            </If>
          </span>
  
          <p>
            <span className={'text-muted-foreground text-sm'}>
              <Trans
                i18nKey={`billing:plans.${selectedProduct.id}.description`}
                defaults={selectedProduct.description}
              />
            </span>
          </p>
        </div>
  
        <If condition={selectedPlan.lineItems.length > 0}>
          <Separator />
  
          <div className={'flex flex-col space-y-2'}>
            <span className={'text-sm font-semibold'}>
              <Trans i18nKey={'billing:detailsLabel'} />
            </span>
  
            <LineItemDetails
              lineItems={selectedPlan.lineItems ?? []}
              selectedInterval={isRecurring ? selectedInterval : undefined}
              currency={selectedProduct.currency}
            />
          </div>
        </If>
  
        <Separator />
  
        <div className={'flex flex-col space-y-2'}>
          <span className={'text-sm font-semibold'}>
            <Trans i18nKey={'billing:featuresLabel'} />
          </span>
  
          {selectedProduct.features.map((item) => {
            return (
              <div key={item} className={'flex items-center space-x-1 text-sm'}>
                <CheckCircle className={'h-4 text-green-500'} />
  
                <span className={'text-secondary-foreground'}>
                  <Trans i18nKey={item} defaults={item} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
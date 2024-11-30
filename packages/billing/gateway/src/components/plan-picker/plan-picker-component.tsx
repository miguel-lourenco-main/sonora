'use client';

import { useMemo } from 'react';

import { ArrowRight, CircleCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  BillingConfig,
  getPrimaryLineItem,
  getProductPlanPair,
  LineItemSchema,
} from '@kit/billing';
import { formatCurrency } from '@kit/shared/utils';
import { Button } from '@kit/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { If } from '@kit/ui/if';
import { Label } from '@kit/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemLabel,
} from '@kit/ui/radio-group';
import { Trans } from '@kit/ui/trans';
import { cn } from '@kit/ui/utils';
import { z } from 'zod';
import { toast } from 'sonner';
import { calculateTieredCost } from '../../lib/utils';


export function PlanPickerComponent(
  props: React.PropsWithChildren<{
    setFormValue: (key: string, value: string, partial?: Partial<{
      shouldValidate: boolean;
      shouldDirty: boolean;
      shouldTouch: boolean;
    }>) => void;
    isFormValid: boolean;
    config: BillingConfig;
    intervals: string[];
    getFormValue: (key: string) => string | number | undefined;
    canStartTrial?: boolean;
    pending?: boolean;
    currentSubscriptionVariantId?: string;
  }>,
) {
  const { t } = useTranslation(`billing`);

  const { t: commonT } = useTranslation(`common`);

  const memoedProps = useMemo(() => props, [props])

  const planId = useMemo(() => memoedProps.getFormValue('planId') as string, [memoedProps]);
  const selectedInterval = useMemo(() => memoedProps.getFormValue('interval') as string, [memoedProps]);

  const { plan: selectedPlan, product: selectedProduct } = useMemo(() => {
    try {
      return getProductPlanPair(props.config, planId);
    } catch {
      return {
        plan: null,
        product: null,
      };
    }
  }, [props.config, planId]);

  // display the period picker if the selected plan is recurring or if no plan is selected
  const isRecurringPlan =
    selectedPlan?.paymentType === 'recurring' || !selectedPlan;

  const locale = useTranslation().i18n.language;

  return (
    <div
        className={'flex w-full max-w-xl flex-col space-y-4'}
    >
        <If condition={props.intervals.length}>
            <div
              className={cn('transition-all', {
                ['pointer-events-none opacity-50']: !isRecurringPlan,
              })}
            >
              <FormField
                name={'interval'}
                render={({ field }) => {
                  return (
                    <FormItem className={'rounded-md border p-4'}>
                      <FormLabel htmlFor={'plan-picker-id'}>
                        <Trans i18nKey={'common:billingInterval.label'} />
                      </FormLabel>

                      <FormControl id={'plan-picker-id'}>
                        <RadioGroup name={field.name} value={field.value}>
                          <div className={'flex space-x-2.5'}>
                            {props.intervals.map((interval) => {
                              const selected = field.value === interval;

                              return (
                                <label
                                  htmlFor={interval}
                                  key={interval}
                                  className={cn(
                                    'flex items-center space-x-2 rounded-md border border-transparent px-4 py-2 transition-colors',
                                    {
                                      ['border-primary']: selected,
                                      ['hover:border-primary']: !selected,
                                    },
                                  )}
                                >
                                  <RadioGroupItem
                                    id={interval}
                                    value={interval}
                                    onClick={() => {
                                      props.setFormValue('interval', interval, {
                                        shouldValidate: true,
                                      });

                                      if (selectedProduct) {
                                        const plan = selectedProduct.plans.find(
                                          (item) => item.interval === interval,
                                        );

                                        props.setFormValue(
                                          'planId',
                                          plan?.id ?? '',
                                          {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                            shouldTouch: true,
                                          },
                                        );
                                      }
                                    }}
                                  />

                                  <span
                                    className={cn('text-sm', {
                                      ['cursor-pointer']: !selected,
                                    })}
                                  >
                                    <Trans
                                      i18nKey={`billing:billingInterval.${interval}`}
                                    />
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </RadioGroup>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </If>

          <FormField
            name={'planId'}
            render={({ field }) => (
              <FormItem className={'rounded-md border p-4'}>
                <FormLabel>
                  <Trans i18nKey={'common:choosePlan'} />
                </FormLabel>

                <FormControl>
                  <RadioGroup
                    name={field.name}
                    value={field.value}
                    className={'space-y-2'}
                  >
                    {props.config.products.map((product) => {
                      const plan = product.plans.find((item) => {
                        if (item.paymentType === 'one-time') {
                          return true;
                        }

                        return item.interval === selectedInterval;
                      });

                      if (!plan) {
                        return null;
                      }

                      const planId = plan.id;
                      const selected = field.value === planId;
                      const pageCount = memoedProps.getFormValue?.('pageCount') as number;

                      const primaryLineItem = getPrimaryLineItem(
                        props.config,
                        planId,
                      );

                      if (!primaryLineItem && !plan.custom) {
                        throw new Error(`Base line item was not found`);
                      }

                      const modifiedLineItem = {...primaryLineItem} as z.infer<typeof LineItemSchema>;

                      // If the product is 'pro', add the page count feature
                      if (product.id === 'pro' && modifiedLineItem) {
                        if (primaryLineItem?.tiers) {
                          const tiers = primaryLineItem.tiers;

                          modifiedLineItem.cost = calculateTieredCost(pageCount, tiers)
                        }
                      }

                      return (
                        <RadioGroupItemLabel
                          selected={selected}
                          key={!plan.custom ? primaryLineItem?.id : plan.id + 'custom' }
                        >
                          {props.currentSubscriptionVariantId !== undefined && plan.lineItems[0]?.id === props.currentSubscriptionVariantId ? (
                            <CircleCheck className={'h-5 w-5 stroke-green-400'} />
                          ):(
                            <RadioGroupItem
                              data-test-plan={plan.id}
                              key={plan.id + selected}
                              id={plan.id}
                              value={plan.id}
                              onClick={() => {
                                if (selected) {
                                  return;
                                }

                                props.setFormValue('planId', planId, {
                                  shouldValidate: true,
                                });

                                props.setFormValue('productId', product.id, {
                                  shouldValidate: true,
                                });
                              }}
                            />
                          )}

                          <div
                            className={
                              'flex w-full flex-col content-center space-y-2 lg:flex-row lg:items-center lg:justify-between lg:space-y-0'
                            }
                          >
                            <Label
                              htmlFor={plan.id}
                              className={
                                'flex flex-col justify-center space-y-2'
                              }
                            >
                              <div className={'flex items-center space-x-2.5'}>
                                <span className="font-semibold">
                                  <Trans
                                    i18nKey={`billing:plans.${product.id}.name`}
                                    defaults={product.name}
                                  />
                                </span>
                              </div>

                              <span className={'text-muted-foreground'}>
                                <Trans
                                  i18nKey={`billing:plans.${product.id}.description`}
                                  defaults={product.description}
                                />
                              </span>
                            </Label>

                            <div
                              className={
                                'flex flex-col space-y-2 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0 lg:text-right'
                              }
                            >
                              <div>
                                <Price key={plan.id}>
                                  {plan.custom ? 'Custom' : formatCurrency({
                                      currencyCode:
                                        product.currency.toLowerCase(),
                                      value: modifiedLineItem.cost,
                                      locale,
                                    })}
                                </Price>

                                <div>
                                  <span className={'text-muted-foreground'}>
                                    <If
                                      condition={
                                        plan.paymentType === 'recurring'
                                      }
                                      fallback={
                                        <Trans i18nKey={`billing:lifetime`} />
                                      }
                                    >
                                      <Trans
                                        i18nKey={`billing:perPeriod`}
                                        values={{
                                          period: selectedInterval,
                                        }}
                                      />
                                    </If>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </RadioGroupItemLabel>
                      );
                    })}
                  </RadioGroup>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />


        {selectedProduct?.id === 'business' ? (
          <Button
            type={'button'}
            onClick={() => {
                toast.success('This is a business account, please contact sales@polydoc.ai for pricing')
            }}
          >
            {commonT(`contactUs`)}
          </Button>
        ):(
            <Button
                data-test="checkout-submit-button"
                disabled={props.pending ?? !props.isFormValid}
            >
                {props.pending ? (
                    t('redirectingToPayment')
                ) : (
                    <>
                        <If
                            condition={selectedPlan?.trialDays && props.canStartTrial}
                            fallback={t(`proceedToPayment`)}
                        >
                            <span>{t(`startTrial`)}</span>
                        </If>

                        <ArrowRight className={'ml-2 h-4 w-4'} />
                    </>
                )}
        </Button>
        )}
    </div>
  );
}

function Price(props: React.PropsWithChildren) {
  return (
    <span
      className={
        'animate-in slide-in-from-left-4 fade-in text-xl font-semibold tracking-tight duration-500'
      }
    >
      {props.children}
    </span>
  );
}

'use client';

import { forwardRef, useEffect, useMemo, useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  BillingConfig,
  type LineItemSchema,
  getPlanIntervals,
  getPrimaryLineItem,
  getProductPlanPair,
} from '@kit/billing';
import { formatCurrency } from '@kit/shared/utils';
import { Badge } from '@kit/ui/badge';
import { Button } from '@kit/ui/button';
import {
  Form,
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
import { Separator } from '@kit/ui/separator';
import { Trans } from '@kit/ui/trans';
import { cn } from '@kit/ui/utils';
import { LineItemDetails } from '../line-item-details';
import { MAX_PAGES_SUBSCRIPTION } from '@kit/shared/constants';
import { PageCounter } from '../page-counter';


export function PolydocPlanPicker(
  props: React.PropsWithChildren<{
    config: BillingConfig;
    onSubmit: (data: { planId: string; productId: string, pageCount: number }) => void;
    canStartTrial?: boolean;
    pending?: boolean;
  }>,
) {
  const { t } = useTranslation(`billing`);
  // Function to update page count

  const intervals = useMemo(
    () => getPlanIntervals(props.config),
    [props.config],
  ) as string[];

  const freeProductId = props.config.products.find(p => p.id === 'free')?.id;

  const form = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
    resolver: zodResolver(
      z
        .object({
          planId: z.string(),
          productId: z.string(),
          pageCount: z.number().optional(),
          interval: z.string().optional(),
        })
        .refine(
          (data) => {
            try {
              const { product, plan } = getProductPlanPair(
                props.config,
                data.planId,
              );

              return product && plan;
            } catch {
              return false;
            }
          },
          { message: t('noPlanChosen'), path: ['planId'] },
        ),
    ),
    defaultValues: {
      interval: intervals[0],
      pageCount: 5,
      planId: '',
      productId: freeProductId ?? '',
    },
  });

  const setPageCount = (value: number) => {
    form.setValue('pageCount', value, { shouldValidate: true });
  };

  const updatePageCount = (value: number) => {
    const clampedValue = Math.min(Math.max(0, value), MAX_PAGES_SUBSCRIPTION);
    console.log('clampedValue', clampedValue);
    setPageCount(clampedValue);
  };

  const { interval: selectedInterval } = form.watch();
  const planId = form.getValues('planId');

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

  // Function to determine the plan based on page count
  const determinePlan = (pages: number) => {
    if (pages <= 5) return 'Free';
    if (pages !== MAX_PAGES_SUBSCRIPTION) return 'Pro';
    return 'Business';
  };

  const [currentPlan, setCurrentPlan] = useState(determinePlan(form.getValues('pageCount')));

  useEffect(() => {
    console.log('form.getValues("pageCount")', form.getValues('pageCount'));
    console.log('currentPlan', currentPlan);
    setCurrentPlan(determinePlan(form.getValues('pageCount')));
  }, [form.getValues('pageCount')]);

  // Update form values when currentPlan changes
  useEffect(() => {

    const product = props.config.products.find(p => p.name === currentPlan);
    if (product) {
      const plan = product.plans.find(p => p.interval === selectedInterval);
      if (plan) {
        form.setValue('planId', plan.id, { shouldValidate: true });
        form.setValue('productId', product.id, { shouldValidate: true });
      }
    }
  }, [currentPlan, selectedInterval]);

  return (
    <Form {...form}>
      <PageCounter initialValue={form.getValues('pageCount')} onPageCountChange={updatePageCount} className="mb-12" />
      <div
        className={
          'flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0'
        }
      >
        <form
          className={'flex w-full max-w-xl flex-col space-y-4'}
          onSubmit={form.handleSubmit(props.onSubmit)}
        >
          <If condition={intervals.length}>
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
                            {intervals.map((interval) => {
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
                                      form.setValue('interval', interval, {
                                        shouldValidate: true,
                                      });

                                      if (selectedProduct) {
                                        const plan = selectedProduct.plans.find(
                                          (item) => item.interval === interval,
                                        );

                                        form.setValue(
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
                    name={field.name}checkout-submit-button
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

                      const primaryLineItem = getPrimaryLineItem(
                        props.config,
                        planId,
                      );

                      if (!primaryLineItem && !plan.custom) {
                        throw new Error(`Base line item was not found`);
                      }

                      // Highlight the plan that matches currentPlan
                      const isCurrentPlan = product.name === currentPlan;

                      return (
                        <RadioGroupItemLabel
                          selected={selected || isCurrentPlan}
                          key={!plan.custom ? primaryLineItem?.id : plan.id + 'custom' }
                        >
                          <RadioGroupItem
                            data-test-plan={plan.id}checkout-submit-button
                            key={plan.id + selected}
                            id={plan.id}
                            value={plan.id}
                            onClick={() => {
                              if (selected) {
                                return;
                              }

                              form.setValue('planId', planId, {
                                shouldValidate: true,
                              });

                              form.setValue('productId', product.id, {
                                shouldValidate: true,
                              });
                            }}
                          />

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

                                <If
                                  condition={
                                    plan.trialDays && props.canStartTrial
                                  }
                                >
                                  <div>
                                    <Badge
                                      className={'px-1 py-0.5 text-xs'}
                                      variant={'success'}
                                    >
                                      <Trans
                                        i18nKey={`billing:trialPeriod`}
                                        values={{
                                          period: plan.trialDays,
                                        }}
                                      />
                                    </Badge>
                                  </div>
                                </If>
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
                                      value: primaryLineItem?.cost ? (primaryLineItem?.cost * form.getValues('pageCount')) : 0,
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

          <div>
            <Button
              data-test="checkout-submit-button"
              disabled={props.pending ?? !form.formState.isValid}
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
          </div>
        </form>

        {selectedPlan && selectedInterval && selectedProduct ? (() => {
          const modifiedProduct = { ...selectedProduct };

          if (selectedProduct.id === 'pro' || selectedProduct.id === 'business') {
            const intervalText = selectedInterval === 'year' ? 'year' : 'month';
            const pageFeature = `${form.getValues('pageCount')} pages per ${intervalText}`;
            
            // Insert the page count feature at index 0
            modifiedProduct.features = [
              pageFeature,
              ...modifiedProduct.features
            ];
          }

          return (
            <PlanDetails
              selectedInterval={selectedInterval}
              selectedPlan={selectedPlan}
              selectedProduct={modifiedProduct}
              pageCount={form.getValues('pageCount')}
            />
          );
        })() : null}
      </div>
    </Form>
  );
}

function PlanDetails({
  selectedProduct,
  selectedInterval,
  selectedPlan,
  pageCount
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
    custom?: boolean;
  };
  pageCount: number;
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
            pageCount={pageCount}
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
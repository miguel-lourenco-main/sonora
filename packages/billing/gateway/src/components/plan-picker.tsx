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
import { Slider } from '@kit/ui/slider';
import { LineItemDetails } from './line-item-details';


const maxPages = 10000; // Maximum number of pages

const UnderscoreInput = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { pageCount: number, setPageCount: (value: number) => void }>((props, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isFocused) {
      interval = setInterval(() => {
        setIsVisible(prev => !prev);
      }, 480);
    } else {
      setIsVisible(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocused]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key >= '0' && e.key <= '9') {
      const newValue = props.pageCount === 0 ? parseInt(e.key, 10) : parseInt(props.pageCount.toString() + e.key, 10);
      props.setPageCount(newValue);
    } else if (e.key === 'Backspace') {
      const newValue = props.pageCount > 9 ? Math.floor(props.pageCount / 10) : 0;
      props.setPageCount(newValue);
    }
  };

  useEffect(() => {
    if (isFocused) {
      divRef.current?.focus();
    }
  }, [isFocused]);

  const maxDigits = maxPages.toString().length;
  const currentDigits = props.pageCount.toString().length;
  const showUnderscore = currentDigits < maxDigits;

  return (
    <div className={cn('hover:bg-muted ease-in-out duration-300 p-2 rounded-lg', isFocused && showUnderscore && props.pageCount !== 0 && 'pr-4')}>
      <div className="relative inline-block">
        <div 
          ref={(node) => {
            divRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          tabIndex={0}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className={cn(
            "inline-block w-fit text-center text-2xl rounded-lg bg-transparent outline-none",
            "ease-in-out duration-300",
            "border-0 ring-0 focus:ring-0 hover:ring-0",
            "shadow-none focus:shadow-none hover:shadow-none",
            props.className
          )}
          style={{
            ...props.style,
            minWidth: '1ch',
          }}
        >
          <span className='text-current'>{props.pageCount}</span>
        </div>
        {isFocused && isVisible && showUnderscore && (
          <span 
            className={cn("absolute bottom-0 w-[1rem] h-[1.5px] bg-current animate-blink", {
              'right-[-1rem]': isFocused,
              'right-0': props.pageCount === 0,
            })}
            style={{ animation: 'blink 1s step-end infinite' }}
          />
        )}
      </div>
    </div>
  );
});

UnderscoreInput.displayName = 'UnderscoreInput';

// Add this to your global CSS or a nearby <style> tag
const blinkingUnderscoreStyle = `
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

export function PlanPicker(
  props: React.PropsWithChildren<{
    config: BillingConfig;
    onSubmit: (data: { planId: string; productId: string }) => void;
    canStartTrial?: boolean;
    pending?: boolean;
  }>,
) {
  const { t } = useTranslation(`billing`);
  const [pageCount, setPageCount] = useState(0);
  // Function to update page count
  const updatePageCount = (value: number) => {
    const clampedValue = Math.min(Math.max(0, value), maxPages);
    console.log('clampedValue', clampedValue);
    setPageCount(clampedValue);
  };

  const intervals = useMemo(
    () => getPlanIntervals(props.config),
    [props.config],
  ) as string[];

  const form = useForm({
    reValidateMode: 'onChange',
    mode: 'onChange',
    resolver: zodResolver(
      z
        .object({
          planId: z.string(),
          productId: z.string(),
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
      planId: '',
      productId: '',
    },
  });

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
    if (pages === 0) return 'Free';
    if (pages <= 200) return 'Pro';
    if (pages <= 500) return 'Business';
    return 'Enterprise';
  };

  const currentPlan = determinePlan(pageCount);

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
      {/* ALU Slider and Input */}
      <div className="text-center mb-12 py-2">
        <div className='flex flex-col items-center justify-center mb-4'>
          <h2 className="text-3xl font-bold">Pages</h2>
          <UnderscoreInput
            pageCount={pageCount}
            setPageCount={(value) => {
              updatePageCount(value);
            }}
          />
        </div>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Slider
            min={0}
            max={maxPages}
            step={50}
            value={[pageCount]}
            onValueChange={(value) => updatePageCount(value[0] ?? 0)}
            className="w-[60%]"
          />
        </div>
      </div>
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

                      if (!plan || plan.custom) {
                        return null;
                      }

                      const planId = plan.id;
                      const selected = field.value === planId;

                      const primaryLineItem = getPrimaryLineItem(
                        props.config,
                        planId,
                      );

                      if (!primaryLineItem) {
                        throw new Error(`Base line item was not found`);
                      }

                      // Highlight the plan that matches currentPlan
                      const isCurrentPlan = product.name === currentPlan;

                      return (
                        <RadioGroupItemLabel
                          selected={selected || isCurrentPlan}
                          key={primaryLineItem.id}
                        >
                          <RadioGroupItem
                            data-test-plan={plan.id}
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
                                  <span>
                                    {formatCurrency({
                                      currencyCode:
                                        product.currency.toLowerCase(),
                                      value: primaryLineItem.cost,
                                      locale,
                                    })}
                                  </span>
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

        {selectedPlan && selectedInterval && selectedProduct ? (
          <PlanDetails
            selectedInterval={selectedInterval}
            selectedPlan={selectedPlan}
            selectedProduct={selectedProduct}
          />
        ) : null}
      </div>
    </Form>
  );
}

function PlanDetails({
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
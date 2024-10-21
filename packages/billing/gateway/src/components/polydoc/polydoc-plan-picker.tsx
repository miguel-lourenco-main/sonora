'use client';

import { memo, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  BillingConfig,
  getPlanIntervals,
  getProductPlanPair,
} from '@kit/billing';
import {
  Form
} from '@kit/ui/form';
import { MAX_PAGES_SUBSCRIPTION } from '@kit/shared/constants';
import { PageAmountInput } from '../page-counter';
import { PlanPickerComponent } from '../plan-picker/plan-picker-component';
import { PlanDetails } from '../plan-picker/plan-details';
import { getPolydocPlanPickerSchema } from './polydoc-plan-picker-schema';

const MemoizedPlanDetails = memo(PlanDetails);

type PolydocPlanPickerFormData = {
  planId: string;
  productId: string;
  pageCount: number;
  interval?: string;
};

export function PolydocPlanPicker(
  props: React.PropsWithChildren<{
    config: BillingConfig;
    onSubmit: (data: PolydocPlanPickerFormData) => void;
    canStartTrial?: boolean;
    pending?: boolean;
    currentProductId?: string;
  }>,
) {
    
  const intervals = useMemo(
    () => getPlanIntervals(props.config),
    [props.config],
  ) as string[];

  const form = useForm<PolydocPlanPickerFormData>({
    reValidateMode: 'onChange',
    mode: 'onChange',
    resolver: zodResolver(getPolydocPlanPickerSchema(props.config)),
    defaultValues: {
      interval: 'month',
      pageCount: 6,
      planId: 'pro-monthly',
      productId: 'pro',
    },
  });

  const setPageCount = (value: number) => {
    form.setValue('pageCount', value, { shouldValidate: true });
  };

  const updatePageCount = (value: number) => {
    const clampedValue = Math.min(Math.max(0, value), MAX_PAGES_SUBSCRIPTION);
    setPageCount(clampedValue);
  };

  const { interval: selectedInterval, planId: selectedPlanId, productId, pageCount } = form.watch();

  // Function to determine the plan based on page count
  const determinePlan = (pages: number) => {
    if (pages <= 5) return 'free';
    if (pages !== MAX_PAGES_SUBSCRIPTION) return 'pro';
    return 'business';
  };

  useEffect(() => {

    const planName = props.config.products.find(p => p.id === productId)?.name;

    const extracted = planName?.split("-")[0]

    switch(extracted) {
      case 'free':
        if(form.getValues('pageCount') > 5){
          form.setValue('pageCount', 5)
        }
        break;
      case 'pro':
        if(form.getValues('pageCount') <= 5){
          form.setValue('pageCount', 6)
        }else if(form.getValues('pageCount') === MAX_PAGES_SUBSCRIPTION){
          form.setValue('pageCount', MAX_PAGES_SUBSCRIPTION - 1)
        }
        break;
      case 'business':
        if(form.getValues('pageCount') !== MAX_PAGES_SUBSCRIPTION){
          form.setValue('pageCount', MAX_PAGES_SUBSCRIPTION)
        }
        break;
    }
  }, [selectedPlanId]);

  // Update form values when currentPlan changes
  useEffect(() => {

    const product = props.config.products.find(p => p.name === determinePlan(pageCount));

    if (product && product.id !== productId) {
      const plan = product.plans.find(p => p.interval === selectedInterval);
      if (plan) {
        form.setValue('planId', plan.id, { shouldValidate: true });
        form.setValue('productId', product.id, { shouldValidate: true });
      }
    }
  }, [pageCount, selectedInterval, productId]);

  //Form Functions
  const onSubmitForm = () => {
    form.handleSubmit(props.onSubmit)
  };

  // Update the getFormValue function
  const getFormValue = (key: string) => {
    const value = form.getValues(key as keyof PolydocPlanPickerFormData);
    
    return value;
  };

  // Update the setFormValue function as well
  const setFormValue = (
    key: string,
    value: string | number,
    partial?: Partial<{
      shouldValidate: boolean;
      shouldDirty: boolean;
      shouldTouch: boolean;
    }> | undefined
  ) => {
    form.setValue(key as keyof PolydocPlanPickerFormData, value, partial);
  };

  const { product: selectedProduct, plan: selectedPlan } = getProductPlanPair(
    props.config,
    selectedPlanId,
  );

  return (
    <Form {...form}>
      <PageAmountInput value={pageCount} onPageCountChange={updatePageCount} />
      <form
        className={'flex space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0'}
        onSubmit={onSubmitForm}
      >
        <PlanPickerComponent 
          isFormValid={form.formState.isValid} 
          setFormValue={setFormValue} 
          getFormValue={getFormValue} 
          onSubmitForm={onSubmitForm} 
          intervals={intervals} 
          currentProductId={props.currentProductId}
          {...props} 
        />
        {selectedPlanId && selectedInterval && productId ? (
          <MemoizedPlanDetails
            selectedInterval={selectedInterval}
            selectedPlan={selectedPlan}
            selectedProduct={selectedProduct}
          />
          ) : null
        }
      </form>
    </Form>
  );
}
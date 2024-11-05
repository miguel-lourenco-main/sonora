'use server'

import { getLogger } from "@kit/shared/logger";
import { createStripeClient } from "../services/stripe-sdk";
import { getSupabaseServerAdminClient } from "@kit/supabase/server-admin-client";
import { Database } from "@kit/supabase/database";

export async function subscribeToFreePlan(name: string, email: string, accountId: string, priceId: string) {

  const stripe = await createStripeClient();

  const customer = await stripe.customers.create({
    name: name,
    email: email,
  });

  return await stripe.subscriptions.create({
    customer: customer.id,
    items: [
      {
        price: priceId,
        quantity: 5,
      },
    ],
    metadata: {
      accountId,
    },
  });
}


export async function cancelSubscription(subscriptionId: string) {

  const { StripeBillingStrategyService } = await import('@kit/stripe');

  const strategy = new StripeBillingStrategyService();

  const payload = {
      subscriptionId,
  }

  return strategy.cancelSubscription(payload);
}

export async function forceRenewSubscription(subscriptionId: string) {

  const stripe = await createStripeClient();
  
  const subscription = await stripe.subscriptions.update(subscriptionId, {
      billing_cycle_anchor: 'now',
      proration_behavior: 'create_prorations',
  });

  return subscription;
}


export async function getScheduledLineItem(scheduleId: string) {

  const stripe = await createStripeClient();

  const subscriptionSchedule = await stripe.subscriptionSchedules.retrieve(
    scheduleId
  );

  const scheduledQuantity = subscriptionSchedule?.phases[1]?.items[0]?.quantity ?? null;
  const scheduledProductId = subscriptionSchedule?.phases[1]?.items[0]?.plan as string | null;

  return { scheduledQuantity, scheduledProductId };
}

export async function getPaymentMethods(customerId: string) {
  const stripe = await createStripeClient();
  return stripe.customers.listPaymentMethods(customerId);
}

export async function clearAllSubscriptionsFromStripe() {
  const stripe = await createStripeClient();
  const subscriptions = await stripe.subscriptions.list({
      limit: 100,
  })

  subscriptions.data.forEach(async (subscription) => {
      await stripe.subscriptions.cancel(subscription.id)
  })
}

export async function triggerSubscriptionSchedule(scheduleId: string) {
  const stripe = await createStripeClient();
  const logger = await getLogger();

  try {
    const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId);

    if (!schedule.phases[1] || !schedule.phases[1].items) {
      throw new Error('No items found in the second phase');
    }

    let subscriptionId = schedule.subscription;

    // Only release if not already released
    if (schedule.status !== 'released') {
      const releasedSchedule = await stripe.subscriptionSchedules.release(scheduleId);
      subscriptionId = releasedSchedule.subscription;
    }

    if (!subscriptionId || !schedule.phases[1].items[0]) {
      throw new Error('No subscription ID found in schedule');
    }

    console.log('schedule', schedule);

    // Update the subscription to apply new phase immediately and create an invoice
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId as string, {
      items: [{
        price: schedule.phases[1].items[0].price as string,
        quantity: schedule.phases[1].items[0].quantity as number,
      }],
      proration_behavior: 'always_invoice',
      billing_cycle_anchor: 'now',
    });

    // Create and pay the invoice immediately
    const invoice = await stripe.invoices.create({
      customer: updatedSubscription.customer as string,
      subscription: subscriptionId as string,
      auto_advance: true,
      pending_invoice_items_behavior: 'include',
    });

    // Pay the invoice to trigger the webhook
    await stripe.invoices.pay(invoice.id);

    logger.info({
      scheduleId,
      subscriptionId,
      status: updatedSubscription.status,
      invoiceId: invoice.id
    }, 'Subscription schedule released and invoice created');

    return updatedSubscription;

  } catch (error) {
    logger.error({
      scheduleId,
      error
    }, 'Error releasing subscription schedule');
    throw error;
  }
}

export async function createScheduleTestClock(scheduleId: string, accountId: string) {
  const stripe = await createStripeClient();
  const logger = await getLogger();

  try {

    
    // Retrieve the schedule to get its start date
    const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId);
    if (!schedule.phases[1]?.start_date) {
      throw new Error('No start date found in second phase');
    }

    // Check for payment methods
    const paymentMethods = await stripe.customers.listPaymentMethods(
      schedule.customer as string,
      { type: 'card' }
    );

    if (paymentMethods.data.length === 0) {
      logger.error({
        scheduleId,
        customerId: schedule.customer
      }, 'No payment method found for customer');
      throw new Error('Customer has no payment method attached');
    }

    // Create a test clock starting now
    const clock = await stripe.testHelpers.testClocks.create({
      frozen_time: Math.floor(Date.now() / 1000),
    });

    // Delete the old subscription if it exists
    if (schedule.subscription) {
      await stripe.subscriptions.cancel(schedule.subscription as string);
    }

    // Create a new subscription with default payment method
    const newSubscription = await stripe.subscriptions.create({
      customer: schedule.customer as string,
      items: schedule.phases[1]?.items.map(item => ({
        price: item.price as string,
        quantity: item.quantity || 1
      })),
      default_payment_method: paymentMethods.data[0]?.id,
      metadata: {
        accountId
      }
    });

    logger.info({
      subscriptionId: newSubscription.id
    }, 'advancing clock');

    // Advance the test clock
    await stripe.testHelpers.testClocks.advance(
      clock.id,
      { 
        frozen_time: schedule.phases[1].start_date
      }
    );

    // Update the subscription's billing cycle to match the test clock
    await stripe.subscriptions.update(newSubscription.id, {
      billing_cycle_anchor: 'now',
      proration_behavior: 'none'
    });

    // Update the schedule with the new subscription
    await stripe.subscriptionSchedules.update(scheduleId, {
      phases: [
        {
          start_date: 'now',
          items: [
            {
              price: schedule.phases[0]?.items[0]?.price as string,
              quantity: schedule.phases[0]?.items[0]?.quantity as number
            }
          ]
        },
        {
          start_date: schedule.phases[1].start_date,
          items: [
            {
              price: schedule.phases[1]?.items[0]?.price as string,
              quantity: schedule.phases[1]?.items[0]?.quantity as number
            }
          ]
        }
      ]
    });

    // Force trigger the schedule phase change
    await triggerSubscriptionSchedule(scheduleId);

    logger.info({
      scheduleId,
      clockId: clock.id,
      startDate: schedule.phases[1].start_date
    }, 'Test clock created and schedule triggered');

    return clock;
  } catch (error) {
    logger.error({
      scheduleId,
      error
    }, 'Error creating test clock for schedule');
    throw error;
  }
}
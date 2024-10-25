'use server'

import { createStripeClient } from "../services/stripe-sdk";

export async function subscribeToFreePlan(name: string, email: string, accountId: string, priceId: string) {

    const stripe = await createStripeClient();
  
    const customer = await stripe.customers.create({
      name: name,
      email: email,
    });
  
    await stripe.subscriptions.create({
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

    console.log('subscription', subscription)
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

    console.log("all subscriptions cleared")
}

export async function triggerSubscriptionSchedule(scheduleId: string) {
  const stripe = await createStripeClient();

  try {
    const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId);

    console.log('30 seconds later schedule', schedule)
    console.log('30 sec', schedule.phases)
    console.log('30 sec items', schedule.phases[0]?.items)
    console.log('30 sec items', schedule.phases[1]?.items)

    //const currentPhase = await stripe.subscriptionSchedules.retrieve(scheduleId);

    const releasedSchedule = await stripe.subscriptionSchedules.update(scheduleId, {
      default_settings: {
        billing_cycle_anchor: 'phase_start',
        billing_thresholds: {
          amount_gte: 50,
          reset_billing_cycle_anchor: true,
        },
      },
      phases: [
        {
          items: [{
            price: schedule.phases[0]?.items[0]?.plan as string,
            quantity: schedule.phases[0]?.items[0]?.quantity as number,
          }],
          start_date: schedule.phases[0]?.start_date,
          end_date: 'now',
        },
        {
          items: [{
            price: schedule.phases[1]?.items[0]?.plan as string,
            quantity: schedule.phases[1]?.items[0]?.quantity as number,
          }],
          start_date: 'now',
          end_date: Math.floor(Date.now() / 1000) + (31 * 24 * 60 * 60)
        }
      ]
    });

    console.log('Subscription schedule released:', releasedSchedule.id);
    console.log('releasedSchedule', releasedSchedule)
    return releasedSchedule;

  } catch (error) {
    console.error('Error releasing subscription schedule:', error);
    throw error;
  }
}

async function activateInvoice(invoiceId: string) {
    const stripe = await createStripeClient();
    return stripe.invoices.update(invoiceId, {
        
    });
}
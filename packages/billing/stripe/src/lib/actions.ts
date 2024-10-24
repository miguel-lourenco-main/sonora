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
    
    await stripe.subscriptions.update(subscriptionId, {
        billing_cycle_anchor: 'now',
        proration_behavior: 'create_prorations',
    });
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
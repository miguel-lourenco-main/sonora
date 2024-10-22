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
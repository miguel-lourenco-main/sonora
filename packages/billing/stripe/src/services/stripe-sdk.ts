import 'server-only';

import { StripeServerEnvSchema } from '../schema/stripe-server-env.schema';
import { getLogger } from '@kit/shared/logger';

const STRIPE_API_VERSION = '2024-12-18.acacia';

/**
 * @description returns a Stripe instance
 */
export async function createStripeClient() {
  const logger = await getLogger();
  
  try {
    const { default: Stripe } = await import('stripe');

    logger.info('Initializing Stripe client');

    // Parse the environment variables and validate them
    const stripeServerEnv = StripeServerEnvSchema.parse({
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhooksSecret: process.env.STRIPE_WEBHOOK_SECRET,
    });

    const stripe = new Stripe(stripeServerEnv.secretKey, {
      apiVersion: STRIPE_API_VERSION,
    });

    // Test the client with a simple API call
    await stripe.customers.list({ limit: 1 }).catch((error) => {
      logger.error({ error }, 'Failed to validate Stripe client with test API call');
      throw error;
    });

    logger.info('Stripe client initialized successfully');
    return stripe;
  } catch (error) {
    logger.error({ 
      error,
      errorName: error instanceof Error ? error.name : 'Unknown',
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    }, 'Failed to initialize Stripe client');
    
    throw error;
  }
}

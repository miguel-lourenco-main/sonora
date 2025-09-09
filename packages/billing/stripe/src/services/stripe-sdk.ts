import 'server-only';

import { StripeServerEnvSchema } from '../schema/stripe-server-env.schema';
import { getLogger } from '@kit/shared/logger';
import type Stripe from 'stripe';

const STRIPE_API_VERSION = '2024-12-18.acacia';
const INITIALIZATION_TIMEOUT = 10000;

let stripeClientInstance: Stripe | null = null;
let initializationPromise: Promise<Stripe> | null = null;

/**
 * @description returns a Stripe instance
 */
export async function createStripeClient() {
  const logger = await getLogger();
  
  // Return existing instance if available
  if (stripeClientInstance) {
    return stripeClientInstance;
  }

  // If there's an ongoing initialization, return its promise
  if (initializationPromise) {
    return initializationPromise;
  }

  // Create new initialization promise
  initializationPromise = (async () => {
    try {
      logger.info('Starting Stripe client initialization');

      // Verify environment variables
      if (!process.env.STRIPE_SECRET_KEY) {
        logger.error('Missing STRIPE_SECRET_KEY environment variable');
        throw new Error('Stripe secret key is not configured');
      }

      if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
        logger.error('Invalid STRIPE_SECRET_KEY format');
        throw new Error('Invalid Stripe secret key format');
      }

      // Import Stripe with logging
      logger.info('Importing Stripe package');
      const { default: StripeConstructor } = await import('stripe');
      logger.info('Stripe package imported successfully');

      // Validate environment variables
      logger.info('Validating environment variables');
      const stripeServerEnv = StripeServerEnvSchema.parse({
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhooksSecret: process.env.STRIPE_WEBHOOK_SECRET,
      });

      // Create Stripe instance
      logger.info('Creating Stripe instance');
      const stripe = new StripeConstructor(stripeServerEnv.secretKey, {
        apiVersion: STRIPE_API_VERSION,
      });

      // Test the connection
      logger.info('Testing Stripe connection');
      await stripe.customers.list({ limit: 1 });
      logger.info('Stripe connection test successful');

      // Store the instance
      stripeClientInstance = stripe;
      return stripe;

    } catch (error) {
      logger.error({ 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      }, 'Failed to initialize Stripe client');
      
      // Clear the initialization promise so future attempts can try again
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

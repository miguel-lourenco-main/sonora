import 'server-only';

import { StripeServerEnvSchema } from '../schema/stripe-server-env.schema';
import { getLogger } from '@kit/shared/logger';
import type Stripe from 'stripe';

const STRIPE_API_VERSION = '2024-12-18.acacia';

let stripeClientInstance: Stripe | null = null;
let initializationPromise: Promise<Stripe> | null = null;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

interface EdgeEnv {
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

/**
 * Gets environment variables in an Edge-compatible way
 */
async function getEnvVars() {
  const logger = await getLogger();
  
  // In Edge runtime, env vars are available on the global env object
  const env = ('env' in globalThis ? (globalThis as unknown as { env: EdgeEnv }).env : process.env) as EdgeEnv;
  
  logger.info({ 
    hasStripeKey: !!env?.STRIPE_SECRET_KEY,
    hasWebhookSecret: !!env?.STRIPE_WEBHOOK_SECRET,
    runtime: typeof process !== 'undefined' ? 'node' : 'edge'
  }, 'Environment check');
  
  return env;
}

/**
 * @description returns a Stripe instance
 */
export async function createStripeClient() {
  const logger = await getLogger();
  
  try {
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
        const env = await getEnvVars();

        // Verify environment variables
        if (!env.STRIPE_SECRET_KEY) {
          throw new Error('Stripe secret key is not configured');
        }

        if (!env.STRIPE_SECRET_KEY.startsWith('sk_')) {
          throw new Error('Invalid Stripe secret key format');
        }

        // Import Stripe
        const stripeModule = await import('stripe');
        const StripeConstructor = stripeModule.default;

        // Validate environment variables
        const stripeServerEnv = StripeServerEnvSchema.parse({
          secretKey: env.STRIPE_SECRET_KEY,
          webhooksSecret: env.STRIPE_WEBHOOK_SECRET,
        });

        // Create and test Stripe instance
        logger.info('Creating and testing Stripe connection');
        const stripe = new StripeConstructor(stripeServerEnv.secretKey, {
          apiVersion: STRIPE_API_VERSION,
          telemetry: false
        });

        try {
          await stripe.customers.list({ limit: 1 });
          logger.info('Stripe connection test successful');
        } catch (testError) {
          logger.error({ 
            error: getErrorMessage(testError),
            stack: getErrorStack(testError)
          }, 'Stripe connection test failed');
          throw testError;
        }

        // Store the instance
        stripeClientInstance = stripe;
        logger.info('Stripe client initialized successfully');
        return stripe;

      } catch (error) {
        logger.error({ 
          error: getErrorMessage(error),
          stack: getErrorStack(error)
        }, 'Failed to initialize Stripe client');
        
        initializationPromise = null;
        stripeClientInstance = null;
        throw error;
      }
    })();

    return initializationPromise;
  } catch (error) {
    initializationPromise = null;
    stripeClientInstance = null;
    
    logger.error({ 
      error: getErrorMessage(error),
      stack: getErrorStack(error)
    }, 'Fatal error in createStripeClient');
    
    throw error;
  }
}

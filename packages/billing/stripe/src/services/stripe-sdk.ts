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

    logger.info('createStripeClient')

    const env = await getEnvVars();
    logger.info({ env })
    
    // Return existing instance if available
    if (stripeClientInstance) {
      logger.info('Using existing Stripe client instance');
      return stripeClientInstance;
    }

    // If there's an ongoing initialization, return its promise
    if (initializationPromise) {
      logger.info('Using existing Stripe client initialization promise');
      return initializationPromise;
    }

    // Create new initialization promise
    initializationPromise = (async () => {
      try {
        logger.info('Starting new Stripe client initialization');

        // Verify environment variables
        if (!env.STRIPE_SECRET_KEY) {
          const error = new Error('Stripe secret key is not configured');
          logger.error({ error: error.message }, 'Missing STRIPE_SECRET_KEY environment variable');
          throw error;
        }

        if (!env.STRIPE_SECRET_KEY.startsWith('sk_')) {
          const error = new Error('Invalid Stripe secret key format');
          logger.error({ error: error.message }, 'Invalid STRIPE_SECRET_KEY format');
          throw error;
        }

        // Import Stripe with logging
        logger.info('Importing Stripe package');
        let StripeConstructor;
        try {
          const stripeModule = await import('stripe');
          StripeConstructor = stripeModule.default;
          logger.info('Stripe package imported successfully');
        } catch (importError) {
          logger.error({ 
            error: getErrorMessage(importError),
            stack: getErrorStack(importError)
          }, 'Failed to import Stripe package');
          throw importError;
        }

        // Validate environment variables
        logger.info('Validating environment variables');
        const stripeServerEnv = StripeServerEnvSchema.parse({
          secretKey: env.STRIPE_SECRET_KEY,
          webhooksSecret: env.STRIPE_WEBHOOK_SECRET,
        });

        // Create Stripe instance
        logger.info('Creating Stripe instance');
        const stripe = new StripeConstructor(stripeServerEnv.secretKey, {
          apiVersion: STRIPE_API_VERSION,
          telemetry: false
        });

        // Test the connection
        logger.info('Testing Stripe connection');
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
        logger.info('Stripe client initialization completed successfully');
        return stripe;

      } catch (error) {
        logger.error({ 
          errorMessage: getErrorMessage(error),
          errorStack: getErrorStack(error),
        }, 'Failed to initialize Stripe client');
        
        // Clear both the promise and instance on failure
        initializationPromise = null;
        stripeClientInstance = null;
        throw error;
      }
    })();

    return initializationPromise;
  } catch (error) {
    // Clear both the promise and instance on any error
    initializationPromise = null;
    stripeClientInstance = null;
    
    logger.error({ 
      errorMessage: getErrorMessage(error),
      errorStack: getErrorStack(error),
    }, 'Fatal error in createStripeClient');
    
    throw error;
  }
}

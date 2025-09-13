export const TEST_TIMEOUTS = {
  // Fast tier - Local development on powerful machines
 
  light_speed: {
    navigation: 2000,    // 2 seconds
    element: 5000,      // 5 seconds
    retry: 10000,        // 10 seconds
    webhook: 10000,      // 10 seconds
    retryAttempts: 3,
    processAction: 0
  },
  fast: {
    navigation: 5000,    // 5 seconds
    element: 10000,      // 10 seconds
    retry: 15000,        // 15 seconds
    webhook: 30000,      // 30 seconds
    retryAttempts: 3,
    processAction: 500
  },

  // Medium tier - CI environments
  medium: {
    navigation: 10000,   // 10 seconds
    element: 20000,      // 20 seconds
    retry: 20000,        // 20 seconds
    webhook: 45000,      // 45 seconds
    retryAttempts: 4,
    processAction: 2000
  },

  // Default tier - Standard testing environments
  default: {
    navigation: 15000,   // 15 seconds
    element: 30000,      // 30 seconds
    retry: 30000,        // 30 seconds
    webhook: 60000,      // 1 minute
    retryAttempts: 5,
    processAction: 4000
  },

  // Slow tier - Resource-constrained environments
  slow: {
    navigation: 30000,   // 30 seconds
    element: 60000,      // 1 minute
    retry: 60000,        // 1 minute
    webhook: 120000,     // 2 minutes
    retryAttempts: 7,
    processAction: 10000
  }
};

// Select tier based on environment variable
const TEST_TIER = process.env.TEST_TIER || 'default';

export const CURRENT_TIMEOUTS = TEST_TIMEOUTS[TEST_TIER as keyof typeof TEST_TIMEOUTS] ?? TEST_TIMEOUTS.default;

export const DOWNGRADE_DELAY = process.env.DOWNGRADE_DELAY ? parseInt(process.env.DOWNGRADE_DELAY) : 20000; // 20 seconds

export async function retryOperation(
  operation: () => Promise<void>, 
  maxAttempts = 3,
  timeout = 10000
) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await operation();
      return;
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error);
      lastError = error;
      
      if (attempt === maxAttempts) break;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  throw lastError;
}
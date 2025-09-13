type ConsoleMethod = 'debug' | 'log' | 'info' | 'warn' | 'error';

function shouldEnableLogs(): boolean {
  const flag = process.env.NEXT_PUBLIC_ENABLE_LOGS;
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return process.env.NODE_ENV !== 'production';
}

function getLogLevel(): ConsoleMethod {
  const value = (process.env.NEXT_PUBLIC_LOG_LEVEL || '').toLowerCase();
  if (value === 'debug' || value === 'log' || value === 'info' || value === 'warn' || value === 'error') {
    return value as ConsoleMethod;
  }
  return 'log';
}

export function installConsoleFilter(): void {
  if (typeof window === 'undefined') return;

  const enabled = shouldEnableLogs();
  if (!enabled) {
    const noop = () => {};
    console.debug = noop;
    console.log = noop;
    console.info = noop;
    console.warn = noop;
    console.error = noop;
    return;
  }

  const level = getLogLevel();
  const order: Record<ConsoleMethod, number> = {
    debug: 10,
    log: 20,
    info: 30,
    warn: 40,
    error: 50,
  };

  const current = order[level];

  const original = {
    debug: console.debug.bind(console),
    log: console.log.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  } as const;

  const maybe = (method: ConsoleMethod) =>
    (...args: unknown[]) => {
      if (order[method] >= current) {
        original[method](...args);
      }
    };

  console.debug = maybe('debug');
  console.log = maybe('log');
  console.info = maybe('info');
  console.warn = maybe('warn');
  console.error = maybe('error');
}



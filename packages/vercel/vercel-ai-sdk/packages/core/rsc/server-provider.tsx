'use server'

import {
    withAIState,
    getAIStateDeltaPromise,
    sealMutableAIState,
} from './ai-state';

import type {
    AIAction,
    InternalAIStateStorageOptions,
} from './types';

export async function innerAction<T>(
    {
      action,
      options,
    }: { action: AIAction; options: InternalAIStateStorageOptions },
    state: T,
    ...args: unknown[]
  ) {
    return await withAIState(
      {
        state,
        options,
      },
      async () => {
        const result = await action(...args);
        sealMutableAIState();
        return [getAIStateDeltaPromise() as Promise<T>, result];
      },
    );
  }
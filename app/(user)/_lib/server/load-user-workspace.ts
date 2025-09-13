import { cache } from 'react';

export interface UserWorkspace {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  accounts: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  currentAccount?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export const loadUserWorkspace = cache(async (): Promise<UserWorkspace> => {
  // This is a placeholder implementation
  // In a real app, this would fetch from your database/API
  return {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: undefined,
    },
    accounts: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: undefined,
      },
    ],
    currentAccount: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: undefined,
    },
  };
});

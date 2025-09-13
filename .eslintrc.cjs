/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './',
      },
    },
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@kit/supabase/database',
            importNames: ['Database'],
            message:
              'Please use the application types from "~/lib/database.types" instead',
          },
        ],
      },
    ],
  },
};

// Use shared configs from tooling/eslint
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  extends: [
    './tooling/eslint/base.js',
    './tooling/eslint/react.js',
    './tooling/eslint/nextjs.js',
    'next',
    'next/core-web-vitals',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: __dirname,
      },
    },
  },
  rules: {
    // project-specific overrides can go here
  },
  ignorePatterns: [
    '**/.eslintrc.cjs',
    '**/*.config.js',
    '**/*.config.cjs',
    '**/node_modules',
    '.next',
    'dist',
    'pnpm-lock.yaml',
  ],
};

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
  ],
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  rules: {
    'react/prop-types': 'off',
    'no-unused-vars': 'off', // Turn off base rule as it can report incorrect errors
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
  },
  ignorePatterns: [
    '**/.eslintrc.cjs',
    '**/*.config.js',
    '**/*.config.cjs',
    '**/node_modules',
    'database.types.ts',
    '.next',
    'dist',
    'pnpm-lock.yaml',
  ],
};

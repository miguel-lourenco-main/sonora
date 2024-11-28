/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ['plugin:@next/next/recommended', 'plugin:next-on-pages/recommended'],
  plugins: ['next-on-pages'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'next-on-pages/no-unsupported-configs': 'warn',
  },
};

module.exports = config;

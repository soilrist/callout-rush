import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'public/', '.inspect-out/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: { process: 'readonly', console: 'readonly', document: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly', URL: 'readonly', Blob: 'readonly', navigator: 'readonly', caches: 'readonly', OfflineAudioContext: 'readonly' },
    },
  },
);

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import sonar from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      sonar.configs.recommended,
      unicorn.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        jest: 'readonly',
        gtag: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      'unicorn/prefer-module': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-process-exit': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/prefer-query-selector': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/no-array-callbacks': 'off',
      'sonarjs/slow-regex': 'off',
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-nested-template-literals': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/concise-regex': 'off',
      'sonarjs/duplicates-in-character-class': 'off',
      'sonarjs/pseudo-random': 'off',
      'sonarjs/link-with-target-blank': 'off',
      'sonarjs/no-os-command-from-path': 'off',
      'sonarjs/no-array-reduce': 'off',
      'sonarjs/bandit': 'off',
      'sonarjs/unnecessary暴涨': 'off',
      'react-refresh/only-export-components': 'warn',
    },
  },
])

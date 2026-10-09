// ESLint flat config — every rule here is explained in guidelines/11-code-quality-and-tooling.md.
// Owner: FE Lead. Do not change it in a feature PR.
import js from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Allowed imports between features, only through the target feature's index.ts (guideline 01 §5).
 * Add a pair only with FE Lead approval.
 */
const ALLOWED_FEATURE_DEPENDENCIES = {
  tickets: ['review', 'feedback'],
};

const featureIndex = (featureNames) => ({
  element: {
    type: 'feature',
    captured: { featureName: featureNames },
    fileInternalPath: 'index.{ts,tsx}',
  },
});

export default defineConfig([
  globalIgnores(['dist', 'coverage', '.vitest', 'public', 'src/shared/api/generated']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      // TypeScript (guideline 04)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-expect-error': 'allow-with-description' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // React (guideline 05)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowExportNames: ['default'] }],
      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: 'error',
    },
  },

  // ---- Import boundaries (guideline 01) -------------------------------------------------------
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': { typescript: { alwaysTryTypes: true, project: './tsconfig.app.json' } },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' },
        { type: 'feature', pattern: 'src/features/*', capture: ['featureName'] },
        { type: 'shared', pattern: 'src/shared/*', capture: ['segment'] },
        { type: 'mocks', pattern: 'src/mocks' },
        { type: 'test', pattern: 'src/test' },
      ],
      'boundaries/files': [{ category: 'test', pattern: '**/*.test.{ts,tsx}' }],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          message:
            'Import not allowed: {{from.element.type}}{{#if from.element.captured.featureName}} "{{from.element.captured.featureName}}"{{/if}} → {{to.element.type}}{{#if to.element.captured.featureName}} "{{to.element.captured.featureName}}"{{/if}}. Features import other features only through index.ts (allowed pairs only); shared never imports features or app. See guidelines/01-project-structure.md §1, §4–5.',
          policies: [
            // Inside one element (same feature, same shared segment, app, mocks, test) anything goes.
            { allow: { dependency: { relationship: { to: 'internal' } } } },
            // shared → shared only.
            {
              from: { element: { type: 'shared' } },
              allow: { to: { element: { type: 'shared' } } },
            },
            // feature → shared, and the allowed features through their index.ts only.
            {
              from: { element: { type: 'feature' } },
              allow: { to: { element: { type: 'shared' } } },
            },
            ...Object.entries(ALLOWED_FEATURE_DEPENDENCIES).map(([from, targets]) => ({
              from: { element: { type: 'feature', captured: { featureName: from } } },
              allow: { to: featureIndex(targets) },
            })),
            // app → shared and any feature's index.ts (route registration).
            {
              from: { element: { type: 'app' } },
              allow: { to: [{ element: { type: 'shared' } }, featureIndex('*')] },
            },
            // mocks → shared and each feature's mocks/handlers.ts (kept out of the production bundle).
            {
              from: { element: { type: 'mocks' } },
              allow: {
                to: [
                  { element: { type: 'shared' } },
                  { element: { type: 'feature', fileInternalPath: 'mocks/**' } },
                ],
              },
            },
            // Test helpers (src/test) → anything; test files → test helpers and mock server.
            { from: { element: { type: 'test' } }, allow: { to: { element: { type: '*' } } } },
            {
              from: { file: { categories: 'test' } },
              allow: { to: [{ element: { type: 'test' } }, { element: { type: 'mocks' } }] },
            },
          ],
        },
      ],
    },
  },

  // ---- Banned imports (guidelines 06, 07, 11) ------------------------------------------------
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/shared/ui/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'antd',
              importNames: ['Tag'],
              message: 'Use StatusTag from @/shared/ui (guideline 07).',
            },
            {
              name: 'antd',
              importNames: ['Table'],
              message: 'Use DataTable from @/shared/ui (guideline 07).',
            },
            {
              name: 'antd',
              importNames: ['Modal'],
              message: 'Use ConfirmDialog or FormModal from @/shared/ui (guideline 07).',
            },
            {
              name: 'antd',
              importNames: ['Upload'],
              message: 'Use EvidenceUpload or CsvUpload from @/shared/ui (guideline 07).',
            },
            {
              name: 'antd',
              importNames: ['message', 'notification'],
              message: 'Use showMessage from @/shared/messages (guideline 06).',
            },
            {
              name: 'react-router-dom',
              message: "React Router 8 has no react-router-dom; import from 'react-router'.",
            },
            { name: 'axios', message: 'All HTTP goes through @/shared/api (guideline 06).' },
          ],
          patterns: [
            {
              group: ['@/shared/api/generated', '@/shared/api/generated/*'],
              message: 'Import API hooks and types from @/shared/api (guideline 06).',
            },
          ],
        },
      ],
    },
  },

  // Config files run in Node, outside the app's tsconfig.
  {
    files: ['*.{js,ts}'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node, parserOptions: { projectService: false } },
  },

  prettier,
]);

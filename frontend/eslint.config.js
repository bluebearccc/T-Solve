// ESLint flat config — every rule here is explained in guidelines/11-code-quality-and-tooling.md.
// Owner: FE Lead. Do not change it in a feature PR.
import js from '@eslint/js';
import { existsSync, readdirSync } from 'node:fs';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
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

/** Every folder in src/features is a feature; new features are picked up automatically. */
const FEATURES_DIR = new URL('./src/features', import.meta.url);
const FEATURES = existsSync(FEATURES_DIR)
  ? readdirSync(FEATURES_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  : [];

const BOUNDARY_HELP = 'See guidelines/01-project-structure.md §4–5.';

/** Zones for import-x/no-restricted-paths: "files in target may not import from from (except …)". */
const boundaryZones = [
  // A feature may import another feature only through its index.ts, and only for the allowed pairs.
  ...FEATURES.map((feature) => ({
    target: `./src/features/${feature}`,
    from: './src/features',
    except: [
      `./${feature}`,
      ...(ALLOWED_FEATURE_DEPENDENCIES[feature] ?? []).map((t) => `./${t}/index.ts`),
    ],
    message: `Feature "${feature}" may import another feature only through its index.ts, and only the allowed pairs (eslint.config.js). ${BOUNDARY_HELP}`,
  })),
  // Features never import app.
  {
    target: './src/features',
    from: './src/app',
    message: `Features never import app/. ${BOUNDARY_HELP}`,
  },
  // shared never imports features, app or mocks.
  {
    target: './src/shared',
    from: ['./src/features', './src/app', './src/mocks'],
    message: `shared/ never imports features/, app/ or mocks/. ${BOUNDARY_HELP}`,
  },
  // app uses a feature only through its index.ts (route registration).
  {
    target: './src/app',
    from: './src/features',
    except: FEATURES.map((feature) => `./${feature}/index.ts`),
    message: `app/ imports a feature only through its index.ts. ${BOUNDARY_HELP}`,
  },
  // mocks/ reads each feature's mocks/ folder only.
  {
    target: './src/mocks',
    from: './src/features',
    except: FEATURES.map((feature) => `./${feature}/mocks`),
    message: `src/mocks imports only features' mocks/ folders. ${BOUNDARY_HELP}`,
  },
  // Only test files may use the test helpers and the mock server.
  {
    target: 'src/{app,features,shared}/**/!(*.test).{ts,tsx}',
    from: ['src/test/**/*', 'src/mocks/**/*'],
    message: `Only *.test.ts(x) files may import src/test or src/mocks. ${BOUNDARY_HELP}`,
  },
];

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
    plugins: { 'import-x': importX },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({ project: './tsconfig.app.json' }),
      ],
    },
    rules: { 'import-x/no-restricted-paths': ['error', { zones: boundaryZones }] },
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

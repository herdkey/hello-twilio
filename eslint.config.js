import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import unused from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Because --fix is often used automatically by file-watchers, we need to
// disable certain rules by default. For example, removing unused imports
// is too aggressive in fix mode. But it seems that IntelliJ doesn't actually
// run ESLint with --fix, so we can't look for the --fix flag.
// https://stackoverflow.com/questions/62885099/how-to-disable-autofix-for-specific-rules-in-eslint-using-cli
const isStrict = process.env.ESLINT_STRICT === 'true';

export default defineConfig(
  // Base JS
  js.configs.recommended,

  // TypeScript (type-aware)
  ...tseslint.configs.recommendedTypeChecked,

  {
    name: 'globals-and-parser',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        allowDefaultProject: true,
      },
    },
  },

  {
    name: 'node-ts-rules',
    plugins: {
      import: importPlugin,
      'unused-imports': unused,
    },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
      'import/internal-regex': '^@shared/',
    },
    rules: {
      'no-console': isStrict ? 'error' : 'warn',
      'unused-imports/no-unused-imports': isStrict ? 'error' : 'off',

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // prefer `import type { Foo } from '...';`
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          // keep `T` annotations like `import('mod').T` allowed if you use them
          disallowTypeAnnotations: false,
          // split value + type into separate import lines (plays nicely with import/order)
          fixStyle: 'separate-type-imports',
        },
      ],
      // also enforce `export type { Foo }`
      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: false },
      ],
    },
  },

  {
    // prettier-ignore
    ignores: [
      'dist/',
      'private/',
      'scripts/',
      '**/*.d.ts',
      '.twilioserverlessrc.js',
      'prettier.config.ts',
      'esbuild.config.js',
    ],
  },

  prettier,
  eslintPluginPrettierRecommended, // runs prettier via ESLint
);

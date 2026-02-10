import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { 'better-tailwindcss': betterTailwindcss },
    settings: {
      'better-tailwindcss': { entryPoint: 'src/index.css' },
    },
    rules: {
      'better-tailwindcss/enforce-consistent-line-wrapping': [
        'warn',
        { printWidth: 80, group: 'newLine' },
      ],
      'better-tailwindcss/enforce-consistent-class-order': 'off',
      'better-tailwindcss/no-unknown-classes': 'off',
      'better-tailwindcss/no-deprecated-classes': 'off',
      'better-tailwindcss/enforce-canonical-classes': 'off',
      'better-tailwindcss/no-conflicting-classes': 'off',
      'better-tailwindcss/no-duplicate-classes': 'warn',
      'better-tailwindcss/no-unnecessary-whitespace': 'warn',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': 'warn',
      'react/jsx-no-target-blank': 'warn',
      'react/display-name': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      'react-hooks/incompatible-library': 'off',
    },
  },
  { rules: eslintConfigPrettier.rules },
];

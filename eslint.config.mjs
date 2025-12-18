import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { ignores: ['dist/', '**/*.spec.ts'] },
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': ['warn']
    }
  }
]

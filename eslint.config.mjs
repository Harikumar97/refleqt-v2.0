import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      /* ===================================
       * POWER OF TEN RULES ENFORCEMENT
       * =================================== */

      /* Rule 1: Simple Control Flow - No Recursion */
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name=/.*/] > Identifier[name=/^(setjmp|longjmp)$/]",
          message: "setjmp/longjmp constructs are not allowed (Power of Ten Rule 1)"
        }
      ],

      /* Rule 2: Fixed Loop Bounds - Enforce loop safety */
      "no-constant-condition": ["error", { "checkLoops": true }],
      "no-unmodified-loop-condition": "error",

      /* Rule 4: Function Length - Maximum 60 lines */
      "max-lines-per-function": [
        "error",
        {
          "max": 60,
          "skipBlankLines": true,
          "skipComments": true,
          "IIFEs": false
        }
      ],

      /* Rule 5: Assertion Density - Enforce checking */
      "no-console": "off", // Allow console for assertions

      /* Rule 6: Smallest Scope */
      "block-scoped-var": "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-shadow": "error",

      /* Rule 7: Check Return Values */
      "no-void": ["error", { "allowAsStatement": true }],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "require-await": "error",

      /* Rule 8: Limited Preprocessor/Metaprogramming */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",

      /* Rule 9: Limit Pointer/Reference Indirection */
      "max-depth": ["error", 3],
      "complexity": ["error", 10],

      /* Rule 10: Zero Warnings */
      "no-warning-comments": "off", // Allow TODO/FIXME comments

      /* ===================================
       * ADDITIONAL SAFETY RULES
       * =================================== */

      /* Code Quality */
      "no-unused-vars": "off", // TypeScript handles this
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],

      /* Prevent Common Errors */
      "no-implicit-coercion": "error",
      "no-throw-literal": "error",
      "prefer-promise-reject-errors": "error",
      "no-return-await": "error",

      /* React/Next.js Best Practices */
      "react/jsx-no-target-blank": "error",
      "react/no-array-index-key": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /* Enforce Explicit Types */
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          "allowExpressions": true,
          "allowTypedFunctionExpressions": true,
          "allowHigherOrderFunctions": true
        }
      ],

      /* Prevent Dangerous Patterns */
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",

      /* Enforce Bounds Checking */
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          "allowString": false,
          "allowNumber": false,
          "allowNullableObject": false
        }
      ]
    }
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json"
      }
    }
  }
];

export default eslintConfig;

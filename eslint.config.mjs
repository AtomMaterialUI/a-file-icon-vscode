import typescriptEslint from "@typescript-eslint/eslint-plugin";
import _import from "eslint-plugin-import";
import unicorn from "eslint-plugin-unicorn";
import i18Next from "eslint-plugin-i18next";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import {fixupPluginRules} from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import jsonc from "eslint-plugin-jsonc";
import parser from "jsonc-eslint-parser";
import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [...compat.extends(
  "plugin:@typescript-eslint/recommended",
  "plugin:unicorn/recommended",
  "plugin:i18next/recommended",
), {
  plugins: {
    "@typescript-eslint": typescriptEslint,
    import: fixupPluginRules(_import),
    unicorn,
    i18next: i18Next,
    "sort-keys-fix": sortKeysFix,
  },

  languageOptions: {
    globals: {
      ...globals.browser,
      ...globals.node,
    },

    parser: tsParser,
    ecmaVersion: 5,
    sourceType: "module",

    parserOptions: {
      project: "tsconfig.json",
    },
  },
}, ...compat.extends("plugin:@typescript-eslint/recommended").map(config => ({
  ...config,
  files: ["**/**.ts"],
})), {
  files: ["**/**.ts"],

  rules: {
    "@typescript-eslint/array-type": ["error", {
      default: "array-simple",
    }],

    "@typescript-eslint/consistent-indexed-object-style": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/consistent-type-imports": "error",

    "@typescript-eslint/member-ordering": ["error", {
      default: [
        "signature",
        "field",
        "static-initialization",
        "constructor",
        ["get", "set"],
        "method",
      ],
    }],

    "@typescript-eslint/method-signature-style": "error",

    "@typescript-eslint/naming-convention": ["warn", {
      format: ["camelCase", "UPPER_CASE", "PascalCase"],
      selector: "variable",
    }],

    "@typescript-eslint/no-confusing-non-null-assertion": "error",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/no-dupe-class-members": "error",
    "@typescript-eslint/no-duplicate-enum-values": "error",
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-extra-non-null-assertion": "error",
    "@typescript-eslint/no-extra-parens": "off",
    "@typescript-eslint/no-extraneous-class": "warn",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/sort-type-constituents": "error",
    camelcase: "error",
    eqeqeq: ["error", "smart"],

    "id-blacklist": [
      "error",
      "any",
      "Number",
      "number",
      "String",
      "string",
      "Boolean",
      "boolean",
      "Undefined",
    ],

    "id-match": "error",
    "import/exports-last": "error",
    "import/first": "error",
    "import/named": "error",
    "import/newline-after-import": "error",
    "import/no-cycle": "error",
    "import/no-default-export": "error",
    "import/no-duplicates": "error",
    "import/no-internal-modules": "off",
    "import/no-namespace": "error",
    "import/order": ["error", {
      groups: [
        ["builtin", "external"],
        "internal",
        ["parent", "sibling", "index"],
        ["type"],
      ],

      "newlines-between": "always",
    }],

    "no-eval": "error",
    "no-trailing-spaces": "error",
    "no-underscore-dangle": "off",
    "no-unsafe-finally": "error",
    "no-var": "error",
    "prefer-const": "error",
    "sort-keys": "error",
    "sort-keys-fix/sort-keys-fix": "error",
    "spaced-comment": "error",

    "unicorn/filename-case": ["error", {
      cases: {
        camelCase: true,
        pascalCase: true,
      },
    }],

    "unicorn/no-array-reduce": "off",
    "unicorn/no-null": "off",
    "unicorn/prefer-code-point": "off",
    "unicorn/prefer-module": "off",
    "unicorn/prefer-ternary": ["off", "only-single-line"],
    "unicorn/import-style": "off",

    "unicorn/prevent-abbreviations": ["error", {
      replacements: {
        env: false,
        i: false,
        j: false,
      },
    }],
  },
}, ...compat.extends("plugin:jsonc/recommended-with-json").map(config => ({
  ...config,
  files: ["**/*.json"],
})), {
  files: ["**/*.json"],

  plugins: {
    jsonc,
  },

  languageOptions: {
    parser: parser,
  },

  ignores: [
    "build/**",
    "**/*.d.ts",
    "package.json",
    "launch.json",
    "tsconfig.json"
  ],

  rules: {
    "jsonc/key-name-casing": "off",
    "jsonc/no-comments": "off",
    "jsonc/sort-keys": "error",
  },
}];

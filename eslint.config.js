import { fileURLToPath } from "node:url";
import globals from "globals";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs["flat/recommended"],
    prettier,
    ...svelte.configs["flat/prettier"],
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        },

        rules: {
            semi: "error",
            "@typescript-eslint/no-unused-vars": "off",
            "prefer-const": "error",
            "@typescript-eslint/array-type": ["error", { default: "array" }],
            "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
            "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "as" }],
            "@typescript-eslint/explicit-function-return-type": [
                "error",
                { allowExpressions: true }
            ],
            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                { accessibility: "no-public" }
            ],
            "sort-imports": "error",
            "no-useless-call": "error",
            "no-var": "error",
            "no-useless-return": "error",
            "no-useless-constructor": "error",
            "no-unneeded-ternary": "error",
            "no-constructor-return": "error",
            "no-duplicate-imports": "error",
            "require-atomic-updates": "error",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-empty-object-type": "off"
        }
    },
    {
        files: ["**/*.svelte"],

        languageOptions: {
            parserOptions: {
                parser: ts.parser
            }
        }
    }
);

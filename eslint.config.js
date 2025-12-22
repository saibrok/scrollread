import vueParser from 'vue-eslint-parser';
import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import vue from 'eslint-plugin-vue';

export default [
    {
        ignores: ['dist/**', 'node_modules/**'],
    },
    js.configs.recommended,
    ...vue.configs['flat/recommended'],
    {
        files: ['**/*.cjs'],
        languageOptions: {
            globals: {
                module: 'readonly',
                require: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                process: 'readonly',
            },
        },
        rules: {
            'no-undef': 'off',
        },
    },
    {
        files: ['**/*.{js,vue}'],
        languageOptions: {
            parser: vueParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                window: 'readonly',
                document: 'readonly',
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                extraFileExtensions: ['.vue'],
            },
        },
        plugins: {
            import: importPlugin,
            prettier: prettierPlugin,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            indent: ['warn', 4],
            'no-alert': 0,
            'no-new': 0,
            'no-param-reassign': [2, { props: false }],
            'no-plusplus': 0,
            'no-shadow': 'off',
            'no-underscore-dangle': 'off',
            'no-undef': 'off',
            'no-useless-return': 'off',
            'prefer-destructuring': [
                'error',
                {
                    object: false,
                    array: false,
                },
            ],
            'prettier/prettier': 'warn',
            'vue/html-indent': [
                'error',
                4,
                {
                    alignAttributesVertically: true,
                },
            ],
            'vue/no-v-html': 'warn',
            'vue/component-name-in-template-casing': [
                'error',
                'PascalCase',
                {
                    registeredComponentsOnly: false,
                    ignores: [],
                },
            ],
            'vue/valid-v-slot': [
                'error',
                {
                    allowModifiers: true,
                },
            ],
            'vue/order-in-components': [
                'error',
                {
                    order: [
                        'el',
                        'name',
                        'parent',
                        'functional',
                        'extends',
                        'mixins',
                        'inheritAttrs',
                        'model',
                        ['provide', 'inject'],
                        'delimiters',
                        'comments',
                        'components',
                        'directives',
                        'filters',
                        'props',
                        'propsData',
                        'data',
                        'computed',
                        'watch',
                        'LIFECYCLE_HOOKS',
                        'methods',
                        'template',
                        'render',
                        'renderError',
                    ],
                },
            ],
            'import/dynamic-import-chunkname': [
                2,
                {
                    importFunctions: ['dynamicImport'],
                    webpackChunknameFormat: 'assets/build/js/[a-zA-Z0-57-9-/_]+',
                },
            ],
            'import/prefer-default-export': 'off',
            'import/extensions': [
                'error',
                {
                    vue: 'always',
                    json: 'always',
                },
            ],
            'simple-import-sort/imports': [
                'warn',
                {
                    groups: [
                        ['^vue', '^@?\\w'],
                        ['^@js', '^@img', '^@sass', '^@fonts'],
                        ['^\\.\\./helpers', '^\\.\\./lib', '^\\.\\./mixins', '^\\.\\./utils', '^\\.\\./'],
                        ['^\\./helpers', '^\\./lib', '^\\./mixins', '^\\./utils', '^\\./'],
                        ['^\\.\\./.*\\.vue$', '^\\./.*\\.vue$'],
                    ],
                },
            ],
            'simple-import-sort/exports': 'warn',
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
                { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
                { blankLine: 'always', prev: 'expression', next: '*' },
                { blankLine: 'any', prev: 'expression', next: 'expression' },
                { blankLine: 'always', prev: ['case', 'default'], next: '*' },
                { blankLine: 'always', prev: '*', next: 'return' },
                { blankLine: 'always', prev: 'directive', next: '*' },
                { blankLine: 'any', prev: 'directive', next: 'directive' },
            ],
        },
    },
    prettierConfig,
];

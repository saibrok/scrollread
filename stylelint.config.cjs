module.exports = {
    customSyntax: 'postcss-html',
    plugins: ['stylelint-order'],
    rules: {
        'selector-class-pattern': [
            '^[a-z0-9]+(?:-[a-z0-9]+)*(?:(?:--|__|_)[a-z0-9]+(?:-[a-z0-9]+)*)*$',
            {
                message:
                    'Classes must be in kebab-case and can use `-` as delimiters, additionally `__` and `_` according to BEM and `--` to describe vuetify classes; PascalCase/camelCase are prohibited.',
            },
        ],
        'order/order': ['custom-properties', 'declarations'],
        'declaration-block-no-redundant-longhand-properties': null,
        'declaration-block-trailing-semicolon': null,
        'declaration-colon-newline-after': null,
        indentation: 4,
        'max-line-length': 160,
        'no-eol-whitespace': null,
        'string-quotes': 'single',
    },
    extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'stylelint-config-standard-vue/scss', 'stylelint-config-clean-order'],
};

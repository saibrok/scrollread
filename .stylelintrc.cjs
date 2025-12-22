module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-vue',
    'stylelint-config-prettier',
  ],
  customSyntax: 'postcss-html',
  rules: {
    'no-empty-source': null,
  },
}

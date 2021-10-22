module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    semi: ['error', 'never'],
    curly: ['error', 'multi-line'],
    'react-native/no-inline-styles': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
  },
}

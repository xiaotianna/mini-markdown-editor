import tsParser from '@typescript-eslint/parser'

export default {
  rules: {
    'no-console': 'off', // 使用console，会输出警告
    'no-sparse-arrays': 'error', // 禁止稀疏数组，如：[1,,2]
    'no-var': 'error', // 禁止使用var，必须使用let或const
    'no-unreachable': 'error' // 禁止在return、throw、continue、break语句之后出现不可达的代码
  },
  files: ['**/*.ts'],
  ignores: ['eslint.config.js'],
  languageOptions: {
    parser: tsParser
  }
}

module.exports = {
  root: true,
  env: {
    node: true
    commonjs: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
    '@vue/prettier', //解决.vue组件名字没有使用多个单词组合
    '@vue/prettier/@typescript-eslint'
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    requireConfigFile: false
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-var-requires': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-loss-of-precision': 'off'
  }
}

// module.exports = {
//   root: true,
//   /* 指定如何解析语法。*/
//   // parser: 'vue-eslint-parser',
//   /* 优先级低于parse的语法解析配置 */
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     parser: '@typescript-eslint/parser',
//     //模块化方案
//     sourceType: 'module',
//   },
//   env: {
//     browser: true,
//     es2021: true,
//     node: true,
//     // 解决 defineProps and defineEmits generate no-undef warnings
//     'vue/setup-compiler-macros': true,
//   },
//   extends: [
//     // https://github.com/vuejs/eslint-plugin-vue
//     // 'plugin:vue/vue3-essential',
//     // https://github.com/vuejs/eslint-config-standard
//     // 'standard'
//     'plugin:vue/vue3-recommended',
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended', // typescript-eslint推荐规则,
//     'plugin:prettier/recommended',
//     './.eslintrc-auto-import.json', // 这是unplugin-auto-import/vite相关配置，自动引入vue相关api
//   ],
//   // 解决 error  Component name "index" should always be multi-word  vue/multi-word-component-names
//   overrides: [
//     {
//       files: ['src/views/**/*.vue'],
//       rules: {
//         'vue/multi-word-component-names': 0,
//       },
//     },
//   ],
//   rules: {
//     // 禁止使用 var
//     'no-var': 'error',
//     semi: 'off',
//     // 优先使用 interface 而不是 type
//     '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
//     '@typescript-eslint/no-explicit-any': 'off', // 可以使用 any 类型
//     '@typescript-eslint/explicit-module-boundary-types': 'off',
//     // 解决使用 require() Require statement not part of import statement. 的问题
//     '@typescript-eslint/no-var-requires': 0,
//     // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/ban-types.md
//     // '@typescript-eslint/ban-types': [
//     //   'error',
//     //   {
//     //     types: {
//     //       // add a custom message to help explain why not to use it
//     //       Foo: "Don't use Foo because it is unsafe",

//     //       // add a custom message, AND tell the plugin how to fix it
//     //       String: {
//     //         message: 'Use string instead',
//     //         fixWith: 'string',
//     //       },

//     //       '{}': {
//     //         message: 'Use object instead',
//     //         fixWith: 'object',
//     //       },
//     //     },
//     //   },
//     // ],
//     // 禁止出现未使用的变量
//     // '@typescript-eslint/no-unused-vars': [
//     //   'error',
//     //   { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
//     // ],
//     // 'vue/html-indent': 'off',
//     // 关闭此规则 使用 prettier 的格式化规则，
//     // 'vue/max-attributes-per-line': ['off'],
//     // 优先使用驼峰，element 组件除外
//     // 'vue/component-name-in-template-casing': [
//     //   'error',
//     //   'PascalCase',
//     //   {
//     //     ignores: ['/^el-/', '/^router-/'],
//     //     registeredComponentsOnly: false,
//     //   },
//     // ],
//     // 强制使用驼峰
//     // camelcase: ["error", { properties: "always" }],
//     // 优先使用 const
//     // 'prefer-const': [
//     //   'error',
//     //   {
//     //     destructuring: 'any',
//     //     ignoreReadBeforeAssign: false,
//     //   },
//     // ],
//   },
// })

// 这是项目发布阶段所需要用到的babel插件
const progPlugins = []
if (process.env.NODE_ENV === 'production') {
  progPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    '@babel/plugin-syntax-dynamic-import',
    // 发布产品时候的插件数组
    ...progPlugins

  ]
}

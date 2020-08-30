const { override, fixBabelImports, addLessLoader } = require('customize-cra')
const lessToJs = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

module.exports = override(
  fixBabelImports('antd', {
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: lessToJs(fs.readFileSync(path.join(__dirname, '/src/theme.less'), 'utf8'))
  })
)

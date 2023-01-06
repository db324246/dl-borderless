const pluginCommonjs = require('@rollup/plugin-commonjs');
const pluginBabel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');

module.exports = {
  input: './src/index.js',
  output: [
    // {
    //   format: "esm",
    //   file: "./lib/dl-borderless.esm.js"
    // },
    {
      format: "esm",
      file: "./lib/dl-borderless.esm.min.js",
      plugins: [
        terser({
          compress: {
            drop_console: true
          }
        })
      ]
    },
    // {
    //   format: "iife",
    //   extend: true,
    //   file: "./lib/dl-borderless.js",
    //   name: "DlBorderless"
    // },
    {
      format: "iife",
      extend: true,
      file: "./lib/dl-borderless.min.js",
      name: "DlBorderless",
      plugins: [
        terser({
          compress: {
            drop_console: true
          }
        })
      ]
    }
  ],
  plugins: [
    pluginCommonjs(),
    pluginBabel({
      exclude: 'node_modules/**'
    })
  ]
}

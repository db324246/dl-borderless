const pluginCommonjs = require('@rollup/plugin-commonjs');
const pluginBabel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');

module.exports = {
  input: './src/index.js',
  output: [
    {
      format: "esm",
      file: "./lib/rollup.esm.js"
    },
    {
      format: "esm",
      file: "./lib/rollup.esm.min.js",
      plugins: [
        terser({
          compress: {
            drop_console: true
          }
        })
      ]
    },
    {
      format: "cjs",
      exports: 'default',
      file: "./lib/rollup.cjs.js"
    },
    {
      format: "cjs",
      exports: 'default',
      file: "./lib/rollup.cjs.min.js",
      plugins: [
        terser({
          compress: {
            drop_console: true
          }
        })
      ]
    },
    {
      format: "iife",
      extend: true,
      file: "./lib/rollup.iife.js",
      name: "DlStore"
    },
    {
      format: "iife",
      extend: true,
      file: "./lib/rollup.iife.min.js",
      name: "DlStore",
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

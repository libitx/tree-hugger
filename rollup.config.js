import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import banner from 'rollup-plugin-banner'

export default  {
  input: 'lib/index.js',
  output: {
    file: 'dist/tree-hugger.min.js',
    format: 'umd',
    name: 'TreeHugger',
    globals: {
      '@babel/runtime/regenerator': '_regeneratorRuntime',
      '@babel/runtime/helpers/asyncToGenerator': '_asyncToGenerator',
      '@babel/runtime/helpers/objectSpread': '_objectSpread',
      '@babel/runtime/helpers/classCallCheck': '_classCallCheck',
      '@babel/runtime/helpers/createClass': '_createClass'
    }
  },
  
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime']
    }),
    uglify({
      mangle: {
        reserved: ['TreeHugger', 'MetaNode', 'bitdb']
      }
    }),
    banner('Tree Hugger - meta-tree-hugger [v<%= pkg.version %>]\n<%= pkg.description %>\n<%= pkg.homepage %>\nCopyright © <%= new Date().getFullYear() %> <%= pkg.author %>')
  ]
};
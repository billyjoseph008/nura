import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

const external = (id) => !/^[./]/.test(id)

const preserveSettings = {
  dir: 'dist',
  format: 'esm',
  preserveModules: true,
  preserveModulesRoot: 'src',
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        ...preserveSettings,
        sourcemap: true,
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
      },
    ],
    plugins: [
      nodeResolve({ extensions: ['.ts', '.tsx'] }),
      typescript({ tsconfig: './tsconfig.build.json' }),
    ],
    external,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        ...preserveSettings,
        entryFileNames: '[name].d.ts',
      },
    ],
    plugins: [dts({ tsconfig: './tsconfig.build.json' })],
    external,
  },
]

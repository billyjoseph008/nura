import path from 'node:path';
import typescript from '@rollup/plugin-typescript';

const external = (id) =>
  id.startsWith('node:') ||
  (!id.startsWith('.') && !path.isAbsolute(id));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  external,
  plugins: [
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
  ],
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  },
};

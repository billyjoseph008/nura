#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const binDir = resolve(__dirname, '../node_modules/.bin');
const tsupBin = resolve(binDir, process.platform === 'win32' ? 'tsup.cmd' : 'tsup');
const pnpmBin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const isWatch = process.argv.includes('--watch');
const baseArgs = [
  'src/index.ts',
  '--format',
  'cjs,esm',
  '--dts',
  '--treeshake',
  '--external',
  '@nura/core,@nura/dom'
];

if (isWatch) {
  baseArgs.push('--watch');
} else {
  baseArgs.push('--minify');
}

const spawnOptions = { stdio: 'inherit' };

function run(command, args) {
  return new Promise((resolvePromise) => {
    const child = spawn(command, args, spawnOptions);
    child.on('exit', (code, signal) => {
      if (signal) {
        process.kill(process.pid, signal);
        return;
      }
      resolvePromise(code ?? 0);
    });
  });
}

const runTsup = async () => {
  if (existsSync(tsupBin)) {
    return run(tsupBin, baseArgs);
  }

  console.warn('Local tsup binary not found. Running "pnpm dlx tsup" instead.');
  const exitCode = await run(pnpmBin, ['dlx', 'tsup', ...baseArgs]);

  if (exitCode !== 0) {
    console.error('\nFailed to execute tsup. Make sure to run "pnpm install" in the repository root.');
  }

  return exitCode;
};

const exitCode = await runTsup();
process.exit(exitCode);

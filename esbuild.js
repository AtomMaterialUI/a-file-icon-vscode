const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

async function main() {
  const context = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],
    logLevel: 'silent',
    plugins: [
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin
    ]
  });
  if (watch) {
    await context.watch();
  } else {
    await context.rebuild();
    await context.dispose();
  }
}

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: 'esbuild-problem-matcher',

  setup(build) {
    build.onStart(() => {
      console.log('[watch] build started');
    });
    build.onEnd(result => {
      for (const {text, location} of result.errors) {
        console.error(`✘ [ERROR] ${text}`);
        console.error(`    ${location.file}:${location.line}:${location.column}:`);
      }
      console.log('[watch] build finished');
    });
  }
};

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch(error => {
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
});

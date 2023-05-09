await Bun.build({
  entrypoints: ['./src/options.js', '/src/inject.js'],
  outdir: './',
})

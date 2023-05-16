const result = await Bun.build({
  entrypoints: ['./src/options.js', '/src/inject.js'],
  outdir: './',
})

if (!result.success) {
  throw new AggregateError(result.logs, "Build failed");
}

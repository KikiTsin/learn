async function init() {
  const { parse } = await import("parse5");
  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite App</title>
    </head>
    <body>
      <div id="app"></div>
      <script type="module" src="/src/main.js"></script>
    </body>
  </html>
  `
  const ast = parse(html, {
    sourceCodeLocationInfo: true,
  });
  console.log('ast', ast)
}
init()

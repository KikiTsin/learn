# figma 插件开发

manifest.json 内配置 main/ui

```json
{
  "main": "code.js",
  "ui": "ui.html"
}
```

## code.js

rollup 打包成 cjs

```js
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'code/code.ts',
    output: {
      file: 'figma/code.js',
      format: 'cjs',
      sourcemap: false,
    },
    plugins: [typescript(), commonjs()],
  },
];
```

## ui.html

可以内嵌 iframe 渲染在线页面，也可以渲染本地页面，打包本地页面的话，需要把 js css 全部打包在 html 中，如果外链形式的话，页面渲染失败（vite 打包的话，可以使用 vite-plugin-singlefile 这个插件。）

- iframe 内支持复制黏贴

```html
<iframe
  name="Inner Plugin Iframe"
  id="plugin-iframe"
  allow="camera 'none'; microphone 'none'; display-capture 'none'; clipboard-write 'none'"
  style="display: block; margin: 0px; border: none; padding: 0px; width: 100%; height: 100%; background-color: white;"
></iframe>
```

- vue dev 模式下，iframe 无法渲染本地页面，需要打包后才能渲染（todo）

# VSCode 插件开发

主渲染入口配置在 package.json 中，main 字段

```json
{
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "d2c.transform",
        "title": "codess"
      }
    ]
  }
}
```

## 渲染页面

createWebviewPanel 创建 webview，渲染页面，可以在 html 内夹在本地资源，可以加载线上资源。

注意事项：

- 本地资源需要在 webviewOptions 中配置 localResourceRoots
- 打包成多页面形式的话，index.html 中有`<link ref="modulepreload" src="">`，会加载失败，被同源策略 block。
- 在 html 内加载 iframe 的话，粘贴操作被同源策略 block

```html
<iframe
  id="active-frame"
  frameborder="0"
  sandbox="allow-same-origin allow-pointer-lock allow-scripts allow-downloads allow-forms"
  allow="cross-origin-isolated; autoplay; clipboard-read; clipboard-write;"
  src="./fake.html?id=08e3f8c0-657e-4d1e-8949-51c6ffff67d0"
  style="display: block; margin: 0px; overflow: hidden; position: absolute; width: 100%; height: 100%; visibility: visible;"
></iframe>
```

```js
function getWebviewOptions(
  extensionUri: vscode.Uri
): vscode.WebviewOptions & vscode.WebviewPanelOptions {
  return {
    enableScripts: true,
    localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist')],
    retainContextWhenHidden: true,
    enableCommandUris: true,
  };
}

function getHtmlForWebview(
  webview: vscode.Webview,
  context: vscode.ExtensionContext
) {
  // // And the uri we use to load this script in the webview
  // const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
  const scriptUri = 'https://aaa.com/index.js';

  // // Uri to load styles into webview
  // const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
  // css 本地资源路径
  //   const stylesPathMainPath = vscode.Uri.joinPath(
  //     context.extensionUri,
  //     'dist',
  //     '/assets/index.css'
  //   );
  const stylesMainUri = 'https://aaa.com/index.css';

  const nonce = getNonce();
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">

      <!--
        <meta http-equiv="Content-Security-Policy" content="default-src 'none';">
        Use a content security policy to only allow loading images from https or from our extension directory,
        and only allow scripts that have a specific nonce.
      -->
      <meta http-equiv="Content-Security-Policy">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${stylesMainUri}" rel="stylesheet">
    </head>
    <body>
      <div id="app"></div>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
}

const panel = vscode.window.createWebviewPanel(
  'panel',
  'panel_name',
  vscode.ViewColumn.Two,
  getWebviewOptions(context.extensionUri)
);

panel.webview.html = getHtmlForWebview(panel.webview, context);
panel.webview.onDidReceiveMessage(
  (message) => {
    switch (message.command) {
      case 'aaa':
        return;
    }
  },
  undefined,
  context.subscriptions
);
```

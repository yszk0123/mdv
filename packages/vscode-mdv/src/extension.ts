import * as vscode from "vscode";

function createWebviewContent({
  cssSrc,
  scriptSrc,
}: {
  cssSrc: vscode.Uri;
  scriptSrc: vscode.Uri;
}): string {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <link rel="stylesheet" href="${cssSrc}" />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="app"></div>
        <script src="${scriptSrc}"></script>
      </body>
    </html>
  `;
}

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand("mdv.helloWorld", () => {
      if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.One);
        return;
      }

      currentPanel = vscode.window.createWebviewPanel(
        "webview",
        "Webview",
        vscode.ViewColumn.One,
        { enableScripts: true }
      );
      const scriptSrc = currentPanel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, "dist", "webview", "index.js")
      );
      const cssSrc = currentPanel.webview.asWebviewUri(
        vscode.Uri.joinPath(
          context.extensionUri,
          "dist",
          "webview",
          "index.css"
        )
      );
      currentPanel.webview.html = createWebviewContent({ cssSrc, scriptSrc });
      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        undefined,
        context.subscriptions
      );
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (currentPanel === undefined) {
        return;
      }
      const text = e.document.getText();
      currentPanel.webview.postMessage({ command: "update", text });
    })
  );
}

export function deactivate() {}

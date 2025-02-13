import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "Webview" is up and running now'
  );

  const disposable = vscode.commands.registerCommand("mdv.helloWorld", () => {
    const panel = vscode.window.createWebviewPanel(
      "webview",
      "Webview",
      vscode.ViewColumn.One
    );
    panel.webview.html = "<h1>Hello World!??????!</h1>";
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

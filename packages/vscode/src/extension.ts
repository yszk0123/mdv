import type { VscodeMessage, WebviewMessage } from '@mdv/core';
import * as vscode from 'vscode';

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

function update(document: vscode.TextDocument, panel: vscode.WebviewPanel) {
  const text = document.getText();
  const message: VscodeMessage = { command: 'update', text };
  panel.webview.postMessage(message);
}

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  let currentDocument: vscode.TextDocument | undefined = undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand('mdv.showPreviewToSide', () => {
      if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.One);
        return;
      }

      currentDocument = vscode.window.activeTextEditor?.document;

      currentPanel = vscode.window.createWebviewPanel('webview', 'Webview', vscode.ViewColumn.One, {
        enableScripts: true,
      });
      const scriptSrc = currentPanel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview', 'index.js'),
      );
      const cssSrc = currentPanel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview', 'index.css'),
      );
      currentPanel.webview.html = createWebviewContent({ cssSrc, scriptSrc });
      currentPanel.webview.onDidReceiveMessage((message: WebviewMessage) => {
        switch (message.command) {
          case 'initialize': {
            if (currentDocument != null && currentPanel != null) {
              update(currentDocument, currentPanel);
            }
            return;
          }
          case 'update': {
            if (currentDocument) {
              const edit = new vscode.WorkspaceEdit();
              edit.replace(
                currentDocument.uri,
                new vscode.Range(0, 0, currentDocument.lineCount, 0),
                message.text,
              );
              vscode.workspace.applyEdit(edit);
            }
            return;
          }
          default: {
            message satisfies never;
            throw new Error(`Unknown command: ${message}`);
          }
        }
      });
      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
          currentDocument = undefined;
        },
        undefined,
        context.subscriptions,
      );
    }),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('mdv.closePreview', () => {
      if (currentPanel) {
        currentPanel.dispose();
        currentPanel = undefined;
        currentDocument = undefined;
      }
    }),
  );

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((document) => {
      if (currentDocument === document) {
        currentDocument = undefined;
      }
    }),
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (currentPanel != null && currentDocument != null && currentDocument === e.document) {
        update(currentDocument, currentPanel);
      }
    }),
  );
}

export function deactivate() {}

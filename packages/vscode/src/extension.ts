import type { Configuration, VscodeMessage, WebviewMessage } from '@mdv/core';
import * as vscode from 'vscode';

const DEBOUNCE_DELAY = 500;

function createWebviewContent({
  cspSource,
  cssSrc,
  scriptSrc,
}: {
  cspSource: string;
  cssSrc: vscode.Uri;
  scriptSrc: vscode.Uri;
}): string {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src ${cspSource}; style-src ${cspSource};">
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

function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
): (...args: T) => () => void {
  let timeout: NodeJS.Timeout | undefined = undefined;
  const cleanup = (): void => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };
  return (...args: T) => {
    cleanup();
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
    return cleanup;
  };
}

export function activate(context: vscode.ExtensionContext) {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  let currentDocument: vscode.TextDocument | undefined = undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand('mdv.showPreviewToSide', () => {
      if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.Two);
        return;
      }

      currentDocument = vscode.window.activeTextEditor?.document;

      const scriptSrc = vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview', 'index.js');
      const cssSrc = vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview', 'index.css');
      currentPanel = vscode.window.createWebviewPanel('webview', 'Webview', vscode.ViewColumn.Two, {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview')],
      });
      currentPanel.webview.html = createWebviewContent({
        cspSource: currentPanel.webview.cspSource,
        cssSrc: currentPanel.webview.asWebviewUri(cssSrc),
        scriptSrc: currentPanel.webview.asWebviewUri(scriptSrc),
      });
      currentPanel.webview.onDidReceiveMessage((message: WebviewMessage) => {
        switch (message.command) {
          case 'initialize': {
            if (currentDocument != null && currentPanel != null) {
              update(currentDocument, currentPanel);
            }
            if (currentPanel != null) {
              const message: VscodeMessage = {
                command: 'updateConfiguration',
                config: vscode.workspace.getConfiguration().get('mdv') as Configuration,
              };
              currentPanel.webview.postMessage(message);
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
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (currentPanel && e.affectsConfiguration('mdv')) {
        const message: VscodeMessage = {
          command: 'updateConfiguration',
          config: vscode.workspace.getConfiguration().get('mdv') as Configuration,
        };
        currentPanel.webview.postMessage(message);
      }
    }),
  );

  {
    const debounced = debounce((document: vscode.TextDocument) => {
      if (currentPanel != null && currentDocument != null && currentDocument === document) {
        update(currentDocument, currentPanel);
      }
    }, DEBOUNCE_DELAY);
    let cleanup = (): void => {};
    context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((e) => {
        cleanup = debounced(e.document);
      }),
    );
    context.subscriptions.push({
      dispose: () => {
        cleanup();
        cleanup = () => {};
      },
    });
  }
}

export function deactivate() {}

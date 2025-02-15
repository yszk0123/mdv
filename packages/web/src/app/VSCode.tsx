import { TableView } from '@/features/table';
import type { VscodeMessage, WebviewMessage } from '@mdv/core';
import { type JSX, useCallback, useEffect, useMemo, useState } from 'react';
import { Markdown } from '../features/markdown';
import { transformMarkdownToTable } from '../features/parser';

const vscode = acquireVsCodeApi();

export function VSCode(): JSX.Element {
  const [text, setText] = useState('');
  const tableText = useMemo(() => transformMarkdownToTable(text), [text]);

  useEffect(() => {
    const message: WebviewMessage = { command: 'initialize' };
    vscode.postMessage(message);
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent<VscodeMessage>): void => {
      const message = event.data;
      switch (message.command) {
        case 'update': {
          setText(message.text);
          return;
        }
        default: {
          message.command satisfies never;
          throw new Error(`Unknown command: ${message}`);
        }
      }
    };
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  const handleSubmit = useCallback((text: string) => {
    const message: WebviewMessage = { command: 'update', text };
    vscode.postMessage(message);
  }, []);

  return (
    <div className="flex flex-col gap-4 bg-background">
      <div className="m-4">
        <Markdown text={tableText} />
      </div>
      <div className="m-4">
        <TableView text={text} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

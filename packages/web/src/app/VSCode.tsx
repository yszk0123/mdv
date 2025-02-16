import { TableEdit } from '@/features/table';
import type { VscodeMessage, WebviewMessage } from '@mdv/core';
import { type JSX, useCallback, useEffect, useState } from 'react';
import { Mode } from './type';
import { EditButton } from './components/EditButton';
import { ViewButton } from './components/ViewButton';
import { MarkdownEdit } from './components/MarkdownEdit';

const vscode = acquireVsCodeApi();

export function VSCode(): JSX.Element {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>(Mode.View);

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
      <div className="flex flex-col gap-4 m-4">
        <div className="self-end">
          {
            {
              [Mode.View]: <EditButton onClick={() => setMode(Mode.Edit)} />,
              [Mode.Edit]: <ViewButton onClick={() => setMode(Mode.View)} />,
            }[mode]
          }
        </div>
        {
          {
            [Mode.View]: <MarkdownEdit text={text} />,
            [Mode.Edit]: <TableEdit text={text} onSubmit={handleSubmit} />,
          }[mode]
        }
      </div>
    </div>
  );
}

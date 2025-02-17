import { TableEdit } from '@/features/table';
import type { VscodeMessage, WebviewMessage } from '@mdv/core';
import { type JSX, useCallback, useEffect, useState } from 'react';
import { EditButton } from './components/EditButton';
import { MarkdownEdit } from './components/MarkdownEdit';
import { ViewButton } from './components/ViewButton';
import { Mode } from './type';

const vscode = acquireVsCodeApi();

export function VSCode(): JSX.Element {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>(Mode.enum.Edit);

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
              [Mode.enum.View]: <EditButton onClick={() => setMode(Mode.enum.Edit)} />,
              [Mode.enum.Edit]: <ViewButton onClick={() => setMode(Mode.enum.View)} />,
            }[mode]
          }
        </div>
        {
          {
            [Mode.enum.View]: <MarkdownEdit text={text} />,
            [Mode.enum.Edit]: <TableEdit text={text} onSubmit={handleSubmit} />,
          }[mode]
        }
      </div>
    </div>
  );
}

import { TableEdit } from '@/features/table';
import {
  DEFAULT_CONFIGURATION,
  type Configuration,
  type VscodeMessage,
  type WebviewMessage,
} from '@mdv/core';
import { type JSX, useCallback, useEffect, useState } from 'react';

const vscode = acquireVsCodeApi();

export function VSCode(): JSX.Element {
  const [text, setText] = useState('');
  const [config, setConfig] = useState<Configuration>(DEFAULT_CONFIGURATION);

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
        case 'updateConfiguration': {
          setConfig(message.config);
          return;
        }
        default: {
          message satisfies never;
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
    <div className="flex flex-col bg-background">
      <div className="flex flex-col gap-4 m-4">
        <div className="flex text-muted-foreground text-sm">Click cell to edit</div>
        <TableEdit config={config} text={text} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

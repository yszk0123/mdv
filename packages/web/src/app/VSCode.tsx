import { type JSX, useEffect, useState } from 'react';
import { Markdown } from '../features/markdown';
import { transformMarkdownToTable } from '../features/parser';

type MesssageData = {
  command: 'update';
  text: string;
};

export function VSCode(): JSX.Element {
  const [text, setText] = useState('');

  useEffect(() => {
    const onMessage = (event: MessageEvent<MesssageData>): void => {
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

  return (
    <div className="m-4 bg-background">
      <Markdown text={transformMarkdownToTable(text)} />
    </div>
  );
}

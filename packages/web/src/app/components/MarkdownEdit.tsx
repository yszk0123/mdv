import { Markdown } from '@/features/markdown';
import { transformMarkdownToTable } from '@/features/parser';
import { useMemo, type JSX } from 'react';

export function MarkdownEdit({ text }: { text: string }): JSX.Element {
  const tableText = useMemo(() => transformMarkdownToTable(text), [text]);

  return <Markdown text={tableText} />;
}

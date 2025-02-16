import type { TableData } from './type';

function stringifyText(s: string): string {
  return s.replace(/\n/g, '\\n');
}

export function stringifyMarkdown(table: TableData): string {
  const maxDepth = table.header.length - 1;
  return table.rows
    .map((row) => {
      const text = row.columns
        .map((column, i) => {
          if (column.text === '') {
            return null;
          }
          if (i === maxDepth) {
            return `- [ ] ${stringifyText(column.text)}`;
          }
          return `\n${'#'.repeat(i + 1)} ${stringifyText(column.text)}\n`;
        })
        .filter((v) => v !== null)
        .join('\n');
      return text;
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

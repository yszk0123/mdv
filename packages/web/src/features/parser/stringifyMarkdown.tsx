import { RowType, type TableColumn, type TableData } from './type';

function stringifyText(s: string): string {
  return s.replace(/\n/g, '\\n');
}

function stringifyLastColumn(rowType: RowType, column: TableColumn): string {
  switch (rowType) {
    case RowType.Text: {
      return stringifyText(column.text);
    }
    case RowType.Checklist: {
      return `- [ ] ${stringifyText(column.text)}`;
    }
    case RowType.Ordered: {
      return `1. ${stringifyText(column.text)}`;
    }
    default: {
      rowType satisfies never;
      return column.text;
    }
  }
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
            return stringifyLastColumn(row.type, column);
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

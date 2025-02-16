import { RowType, type TableColumn, type TableData } from './type';

function stringifyText(s: string): string {
  return s.replace(/\n/g, '\\n');
}

function stringifyLastColumn(rowType: RowType, column: TableColumn, depth: number): string {
  switch (rowType) {
    case RowType.Text: {
      return `${'#'.repeat(depth + 1)} ${stringifyText(column.text)}`;
    }
    case RowType.Checklist: {
      return `- [ ] ${stringifyText(column.text)}`;
    }
    case RowType.Ordered: {
      return `1. ${stringifyText(column.text)}`;
    }
    case RowType.Raw: {
      return column.text;
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
            return stringifyLastColumn(row.type, column, i);
          }
          return `${'#'.repeat(i + 1)} ${stringifyText(column.text)}`;
        })
        .filter((v) => v !== null)
        .join('\n');
      const raws = row.raws.length ? row.raws.join('\n') : null;
      return [raws, text].filter((v) => v !== null).join('\n');
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

import { type TableColumn, type TableData, TableItemType } from './type';

function stringifyText(s: string): string {
  return s.replace(/\n/g, '\\n');
}

function stringifyColumn(column: TableColumn, depth: number): string {
  switch (column.type) {
    case TableItemType.Heading: {
      return `${'#'.repeat(depth + 1)} ${stringifyText(column.text)}`;
    }
    case TableItemType.Checklist: {
      return `- [ ] ${stringifyText(column.text)}`;
    }
    case TableItemType.Ordered: {
      return `${column.level}. ${stringifyText(column.text)}`;
    }
    default: {
      column.type satisfies never;
      return column.text;
    }
  }
}

export function stringifyMarkdown(table: TableData): string {
  return table.rows
    .map((row) => {
      return row.columns
        .map((column, i) => {
          if (column.text === '') {
            return null;
          }
          return `${column.heading}${stringifyColumn(column, i)}${column.trailing}`;
        })
        .filter((v) => v !== null)
        .join('\n');
    })
    .join('\n')
    .trim();
}

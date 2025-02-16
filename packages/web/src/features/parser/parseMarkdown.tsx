import { type Line, RowType, type TableData, type TableRow } from './type';

function times(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

function repeatWithFn<T>(n: number, fn: (index: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}

function parseText(s: string): string {
  return s.replace(/\\n/g, '\n');
}

const MARKDOWN_PATTERN = /^(?:#+|- \[ \]|\d+\.) /;

export function parseMarkdown(text: string): TableData {
  let prevDepth = 0;
  const lines: Line[] = text
    .split('\n')
    .filter((line) => MARKDOWN_PATTERN.test(line))
    .map((line) => {
      const depth = (line.match(/#+/)?.[0].length || 1) - 1;
      if (/^- \[ \] /.test(line)) {
        return {
          depth: prevDepth + 1,
          text: parseText(line.replace(/- \[ \] /, '')),
          type: RowType.Checklist,
        };
      }
      if (/^\d+\. /.test(line)) {
        return {
          depth: prevDepth + 1,
          text: parseText(line.replace(/^\d+\. /, '')),
          type: RowType.Ordered,
        };
      }
      prevDepth = depth;
      return { depth, text: parseText(line.replace(/^#+ /, '')), type: RowType.Text };
    });

  const maxDepth = Math.max(...lines.map((row) => row.depth));
  const createRow = (): TableRow => {
    return {
      type: RowType.Text,
      columns: times(maxDepth).map((i) => ({ text: '' })),
    };
  };
  const rows: TableRow[] = [];
  let currentRow: TableRow = createRow();
  for (const line of lines) {
    switch (line.type) {
      case RowType.Text: {
        currentRow.columns[line.depth] = { text: line.text };
        break;
      }
      case RowType.Checklist:
      case RowType.Ordered: {
        currentRow.type = line.type;
        currentRow.columns[maxDepth] = { text: line.text };
        rows.push(currentRow);
        currentRow = createRow();
        break;
      }
      default: {
        line.type satisfies never;
        break;
      }
    }
  }
  return {
    header: repeatWithFn(maxDepth + 1, (i) => `項目${i + 1}`),
    separator: repeatWithFn(maxDepth + 1, () => '---'),
    rows,
  };
}

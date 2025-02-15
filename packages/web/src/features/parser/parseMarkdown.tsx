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

export function parseMarkdown(text: string): TableData {
  let prevDepth = 0;
  const lines: Line[] = text
    .split('\n')
    .filter((line) => line.startsWith('#') || line.startsWith('- [ ]'))
    .map((line) => {
      const depth = (line.match(/#+/)?.[0].length || 1) - 1;
      if (/^- \[ \] /.test(line)) {
        return {
          depth: prevDepth + 1,
          text: parseText(line.replace(/- \[ \] /, '')),
          type: RowType.Checklist,
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
    if (line.type === RowType.Checklist) {
      currentRow.columns[maxDepth] = { text: line.text };
      rows.push(currentRow);
      currentRow = createRow();
    } else {
      currentRow.columns[line.depth] = { text: line.text };
    }
  }
  return {
    header: repeatWithFn(maxDepth + 1, (i) => `項目${i + 1}`),
    separator: repeatWithFn(maxDepth + 1, () => '---'),
    rows,
  };
}

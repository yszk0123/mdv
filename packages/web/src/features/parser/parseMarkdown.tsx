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

function parseLines(text: string): Line[] {
  const lines: Line[] = [];
  let prevDepth = 0;
  let heading = '';
  for (const line of text.split('\n')) {
    const depth = (line.match(/#+/)?.[0].length || 1) - 1;
    switch (true) {
      case /^- \[ \] /.test(line): {
        lines.push({
          type: RowType.Checklist,
          depth: prevDepth + 1,
          text: parseText(line.replace(/- \[ \] /, '')),
          heading,
          trailing: '',
        });
        heading = '';
        break;
      }
      case /^\d+\. /.test(line): {
        lines.push({
          type: RowType.Ordered,
          depth: prevDepth + 1,
          text: parseText(line.replace(/^\d+\. /, '')),
          heading,
          trailing: '',
        });
        heading = '';
        break;
      }
      case /^#+ /.test(line): {
        prevDepth = depth;
        lines.push({
          type: RowType.Text,
          depth,
          text: parseText(line.replace(/^#+ /, '')),
          heading,
          trailing: '',
        });
        heading = '';
        break;
      }
      default: {
        const currentLine = lines[lines.length - 1];
        if (currentLine) {
          currentLine.trailing += `\n${line}`;
        } else {
          heading = `${heading}${line}\n`;
        }
        break;
      }
    }
  }
  return lines;
}

export function parseMarkdown(text: string): TableData {
  const lines = parseLines(text);

  const maxDepth = Math.max(...lines.map((row) => row.depth));
  const createRow = (): TableRow => {
    return {
      type: RowType.Text,
      columns: times(maxDepth).map((i) => ({ text: '', heading: '', trailing: '' })),
    };
  };
  const rows: TableRow[] = [];
  let currentRow: TableRow = createRow();
  for (const line of lines) {
    switch (line.type) {
      case RowType.Text: {
        currentRow.columns[line.depth] = {
          text: line.text,
          heading: line.heading,
          trailing: line.trailing,
        };
        break;
      }
      case RowType.Checklist:
      case RowType.Ordered: {
        currentRow.type = line.type;
        currentRow.columns[maxDepth] = {
          text: line.text,
          heading: line.heading,
          trailing: line.trailing,
        };
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

  if (currentRow.columns.some((column) => column.text !== '')) {
    rows.push(currentRow);
  }
  if (rows.length === 0) {
    return {
      header: [],
      separator: [],
      rows: [],
    };
  }

  return {
    header: repeatWithFn(maxDepth + 1, (i) => `項目${i + 1}`),
    separator: repeatWithFn(maxDepth + 1, () => '---'),
    rows,
  };
}

interface Line {
  depth: number;
  text: string;
  type: RowType;
}

function times(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

function repeatWithFn<T>(n: number, fn: (index: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}

const RowType = {
  Text: "text",
  Checklist: "checklist",
  Ordered: "ordered",
} as const;
type RowType = (typeof RowType)[keyof typeof RowType];
interface Column {
  text: string;
}
interface Row {
  type: RowType;
  columns: Column[];
}
interface TableData {
  header: string[];
  separator: string[];
  rows: Row[];
}

function parseMarkdown(text: string): TableData {
  let prevDepth = 0;
  const lines: Line[] = text
    .split("\n")
    .filter((line) => line.startsWith("#") || line.startsWith("- [ ]"))
    .map((line) => {
      const depth = (line.match(/#+/)?.[0].length || 1) - 1;
      const text = line.replace(/^#+ /, "");
      if (/^- \[ \] /.test(text)) {
        return {
          depth: prevDepth + 1,
          text: text.replace(/- \[ \] /, "").replace(/\\n/g, "<br/>"),
          type: RowType.Checklist,
        };
      }
      prevDepth = depth;
      return { depth, text, type: RowType.Text };
    });

  const maxDepth = Math.max(...lines.map((row) => row.depth));
  const createRow = (): Row => {
    return {
      type: RowType.Text,
      columns: times(maxDepth).map((i) => ({ text: "" })),
    };
  };
  const rows: Row[] = [];
  let currentRow: Row = createRow();
  let previousRow: Row | null = null;
  for (const line of lines) {
    if (line.type === RowType.Checklist) {
      currentRow.columns[maxDepth] = { text: line.text };
      rows.push(currentRow);
      previousRow = currentRow;
      currentRow = createRow();
    } else {
      currentRow.columns[line.depth] = { text: line.text };
    }
  }
  return {
    header: repeatWithFn(maxDepth + 1, (i) => `項目${i + 1}`),
    separator: repeatWithFn(maxDepth + 1, () => "---"),
    rows,
  };
}

export function transformMarkdownToTable(text: string): string {
  const table = parseMarkdown(text);

  const header = ["|", table.header.join(" | "), "|"].join(" ");
  const separator = ["|", table.separator.join(" | "), "|"].join(" ");

  return [
    header,
    separator,
    ...table.rows.map(
      (row) => `| ${row.columns.map((column) => column.text).join(" | ")} |`
    ),
  ].join("\n");
}

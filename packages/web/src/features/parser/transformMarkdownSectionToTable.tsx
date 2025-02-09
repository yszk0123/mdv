interface Line {
  depth: number;
  text: string;
  checklist: boolean;
}

function repeatWithString(n: number, str: string): string[] {
  return Array.from({ length: n }, () => str);
}

function repeatWithFn<T>(n: number, fn: (index: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}

export function transformMarkdownSectionToTable(text: string): string {
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
          checklist: true,
        };
      }
      prevDepth = depth;
      return { depth, text, checklist: false };
    });

  const maxDepth = Math.max(...lines.map((row) => row.depth));
  const createRow = () => repeatWithString(maxDepth + 1, "");
  const rows: string[][] = [];
  let currentRow: string[] = createRow();
  let previousRow: string[] | null = null;
  for (const line of lines) {
    if (line.checklist) {
      currentRow[maxDepth] = line.text;
      rows.push(currentRow);
      previousRow = currentRow;
      currentRow = createRow();
    } else {
      currentRow[line.depth] = line.text;
    }
  }

  const header = [
    "|",
    repeatWithFn(maxDepth + 1, (i) => `項目${i + 1}`).join(" | "),
    "|",
  ].join(" ");

  const separator = [
    "|",
    repeatWithFn(maxDepth + 1, () => "---").join(" | "),
    "|",
  ].join(" ");

  return [
    header,
    separator,
    ...rows.map((columns) => `| ${columns.join(" | ")} |`),
  ].join("\n");
}

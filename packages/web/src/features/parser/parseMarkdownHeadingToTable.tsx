interface Row {
  depth: number;
  text: string;
}

export function parseMarkdownHeadingToTable(text: string): string {
  const lines = text.split("\n");
  let prevDepth = 0;
  const rows: Row[] = lines
    .filter((line) => line.startsWith("#") || line.startsWith("- [ ]"))
    .map((line) => {
      const depth = (line.match(/#+/)?.[0].length || 1) - 1;
      const text = line.replace(/^#+ /, "");
      if (/^- \[ \] /.test(text)) {
        return {
          depth: prevDepth + 1,
          text: text.replace(/- \[ \] /, "").replace(/\\n/g, "<br/>"),
        };
      }
      prevDepth = depth;
      return { depth, text };
    });
  const maxDepth = Math.max(...rows.map((row) => row.depth));

  const table = rows.map((row, index) => {
    const cells = Array.from({ length: maxDepth }, () => "");
    cells[row.depth] = row.text;
    return cells;
  });
  const memCells = Array.from({ length: maxDepth }, () => "");
  const collasedTable = table
    .map((row) => {
      const newRow = row.map((cell, index) => {
        if (cell === "" && memCells[index] !== "") {
          return memCells[index];
        }
        memCells[index] = cell;
        return cell;
      });
      return newRow;
    })
    .filter((row) => row[maxDepth]);

  return [
    `| ${Array.from({ length: maxDepth + 1 })
      .map((_v, i) => `項目${i + 1}`)
      .join(" | ")} |`,
    `| ${Array.from({ length: maxDepth + 1 }, () => "---").join(" | ")} |`,
    ...collasedTable.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

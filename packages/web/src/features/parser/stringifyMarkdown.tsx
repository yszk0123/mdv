import type { TableData } from "./type";

export function stringifyMarkdown(table: TableData): string {
  const maxDepth = table.header.length - 1;
  return table.rows
    .map((row) => {
      const text = row.columns
        .map((column, i) => {
          if (column.text === "") {
            return null;
          }
          if (i === maxDepth) {
            return `- [ ] ${column.text.replace(/\n/g, "\\n")}`;
          }
          return `${"#".repeat(i + 1)} ${column.text}`;
        })
        .filter((v) => v !== null)
        .join("\n");
      return text;
    })
    .join("\n");
}

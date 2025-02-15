import { parseMarkdown } from "./parseMarkdown";

export function transformMarkdownToTable(text: string): string {
  const table = parseMarkdown(text);

  const header = ["|", table.header.join(" | "), "|"].join(" ");
  const separator = ["|", table.separator.join(" | "), "|"].join(" ");

  return [
    header,
    separator,
    ...table.rows.map(
      (row) =>
        `| ${row.columns
          .map((column) => column.text.replace(/\n/g, "<br/>"))
          .join(" | ")} |`
    ),
  ].join("\n");
}

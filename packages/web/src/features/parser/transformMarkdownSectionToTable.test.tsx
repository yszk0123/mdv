import { test, expect } from "vitest";
import { transformMarkdownToTable } from "./transformMarkdownSectionToTable";

interface TestCase {
  title: string;
  input: string;
  expected: string;
}

function stripCommonIndent(text: string) {
  const lines = text.replace(/^\n+/, "").trimEnd().split("\n");
  const indent = Math.min(
    ...lines
      .filter((line) => line.trim() !== "")
      .map((line) => line.match(/^\s*/)?.[0].length || 0)
  );
  return lines.map((line) => line.slice(indent)).join("\n");
}

test.each<TestCase>([
  {
    title: "empty rows should return empty table",
    input: stripCommonIndent(""),
    expected: stripCommonIndent(`
      |  |
      |  |
    `),
  },
  {
    title: "single heading with single checklist should return single row",
    input: stripCommonIndent(`
      # Title 1
      - [ ] Item 1
    `),
    expected: stripCommonIndent(`
      | 項目1 | 項目2 |
      | --- | --- |
      | Title 1 | Item 1 |
    `),
  },
  {
    title:
      "nested headings with single checklist should return single row with multiple columns",
    input: stripCommonIndent(`
      # Title 1
      ## Title 2
      - [ ] Item 1
    `),
    expected: [
      "| 項目1 | 項目2 | 項目3 |",
      "| --- | --- | --- |",
      "| Title 1 | Title 2 | Item 1 |",
    ].join("\n"),
  },
  {
    title: "heading with empty checklist should be ignored",
    input: stripCommonIndent(`
      # Title 1
      ## Title 2
      - [ ] Item 1
      ### Title 3
    `),
    expected: stripCommonIndent(`
      | 項目1 | 項目2 | 項目3 |
      | --- | --- | --- |
      | Title 1 | Title 2 | Item 1 |
    `),
  },
  {
    title:
      "nested headings with multiple checklists should return multiple rows",
    input: stripCommonIndent(`
      # Title 1
      ## Title 2
      - [ ] Item 1
      - [ ] Item 2
      # Title 3
      - [ ] Item 3
    `),
    expected: stripCommonIndent(`
      | 項目1 | 項目2 | 項目3 |
      | --- | --- | --- |
      | Title 1 | Title 2 | Item 1 |
      |  |  | Item 2 |
      | Title 3 |  | Item 3 |
    `),
  },
  {
    title: "nested headings with nested checklists should return multiple rows",
    input: stripCommonIndent(`
      # Title 1
      - [ ] Item 1
      ## Title 2
      - [ ] Item 2
    `),
    expected: stripCommonIndent(`
      | 項目1 | 項目2 | 項目3 |
      | --- | --- | --- |
      | Title 1 |  | Item 1 |
      |  | Title 2 | Item 2 |
    `),
  },
])("$title", ({ input, expected }) => {
  expect(transformMarkdownToTable(input)).toBe(expected);
});

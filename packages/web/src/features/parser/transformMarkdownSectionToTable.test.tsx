import { expect, test } from 'vitest';
import { stripCommonIndent } from './stripCommonIndent';
import { transformMarkdownToTable } from './transformMarkdownSectionToTable';

test.each<{
  title: string;
  input: string;
  expected: string;
}>([
  {
    title: 'empty rows should return empty table',
    input: stripCommonIndent(''),
    expected: stripCommonIndent(''),
  },
  {
    title: 'single heading with single checklist should return single row',
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
    title: 'nested headings with single checklist should return single row with multiple columns',
    input: stripCommonIndent(`
      # Title 1
      ## Title 2
      - [ ] Item 1
    `),
    expected: [
      '| 項目1 | 項目2 | 項目3 |',
      '| --- | --- | --- |',
      '| Title 1 | Title 2 | Item 1 |',
    ].join('\n'),
  },
  {
    title: 'heading with empty checklist should be ignored',
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
      |  |  | Title 3 |
    `),
  },
  {
    title: 'nested headings with multiple checklists should return multiple rows',
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
    title: 'nested headings with nested checklists should return multiple rows',
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
  {
    title: 'newlines in checklist items should be escaped',
    input: stripCommonIndent(`
      # Title 1
      - [ ] Item 1\\nwith newline
    `),
    expected: stripCommonIndent(`
      | 項目1 | 項目2 |
      | --- | --- |
      | Title 1 | Item 1<br/>with newline |
    `),
  },
  {
    title: 'checklist and ordered list should be parsed correctly',
    input: stripCommonIndent(`
      # Title 1

      - [ ] Checklist 1
      - [ ] Checklist 2
      1. Ordered 1
      1. Ordered 2
    `),
    expected: stripCommonIndent(`
      | 項目1 | 項目2 |
      | --- | --- |
      | Title 1 | Checklist 1 |
      |  | Checklist 2 |
      |  | Ordered 1 |
      |  | Ordered 2 |
    `),
  },
  {
    title: 'raw text should be ignored in table',
    input: stripCommonIndent(`
      <!-- comment -->
      # Title 1
    `),
    expected: stripCommonIndent(`
      | 項目1 |
      | --- |
      | Title 1 |
    `),
  },
])('$title', ({ input, expected }) => {
  expect(transformMarkdownToTable(input)).toBe(expected);
});

import { expect, test } from 'vitest';
import { parseMarkdown } from './parseMarkdown';
import { stringifyMarkdown } from './stringifyMarkdown';
import { stripCommonIndent } from './stripCommonIndent';

test.each<{
  title: string;
  input: string;
}>([
  {
    title: 'empty rows should return empty table',
    input: stripCommonIndent(''),
  },
  {
    title: 'single heading with single checklist should return single row',
    input: stripCommonIndent(`
      # Title 1
      - [ ] Item 1
    `),
  },
  {
    title: 'nested headings with single checklist should return single row with multiple columns',
    input: stripCommonIndent(`
      # Title 1
      ## Title 2
      - [ ] Item 1
    `),
  },
  {
    title: 'heading with empty checklist should be ignored',
    input: stripCommonIndent(`
      # Title 1
      ## Title 2
      - [ ] Item 1
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
  },
  {
    title: 'nested headings with nested checklists should return multiple rows',
    input: stripCommonIndent(`
      # Title 1
      - [ ] Item 1

      ## Title 2
      - [ ] Item 2
    `),
  },
  {
    title: 'newlines in checklist items should be escaped',
    input: stripCommonIndent(`
      # Title 1
      - [ ] Item 1\\nwith newline
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
  },
  {
    title: 'preserve blank lines',
    input: stripCommonIndent(`
      # Title 1

      ## Title 2


      - [ ] Item 1
    `),
  },
  {
    title: 'preserve heading raw text',
    input: stripCommonIndent(`
      heding 1
      heding 2

      # Title 1
    `),
  },
  {
    title: 'preserve trailing raw text',
    input: stripCommonIndent(`
      # Title 1

      trailing 1
      trailing 2
    `),
  },
  {
    title: 'preserve other raw text',
    input: stripCommonIndent(`
      # Title 1
      - [ ] Item 1
      raw text 1
      - [ ] Item 2
      raw text 2
      # Title 2
    `),
  },
])('$title', ({ input }) => {
  expect(stringifyMarkdown(parseMarkdown(input))).toBe(input);
});

import { DEFAULT_HEADER, type ParserOptions } from '@mdv/core';
import { type Line, type TableData, TableItemType, type TableRow } from './type';

interface ReplaceContext {
  level: number;
  depth: number;
}
function replace(text: string, context: ReplaceContext): string {
  return text
    .replaceAll('${level}', String(context.level))
    .replaceAll('${depth}', String(context.depth));
}

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
  let heading = '';
  for (const line of text.split('\n')) {
    switch (true) {
      case /^#+ /.test(line): {
        const level = line.match(/^#+/)?.[0].length ?? 1;
        lines.push({
          type: TableItemType.Heading,
          level,
          depth: 0,
          text: parseText(line.replace(/^#+ /, '')),
          heading,
          trailing: '',
        });
        heading = '';
        break;
      }
      case /^- \[ \] /.test(line): {
        lines.push({
          type: TableItemType.Checklist,
          level: 1,
          depth: 0,
          text: parseText(line.replace(/- \[ \] /, '')),
          heading,
          trailing: '',
        });
        heading = '';
        break;
      }
      case /^\d+\. /.test(line): {
        const level = Number.parseInt(line.match(/^\d+/)?.[0] || '1', 10);
        lines.push({
          type: TableItemType.Ordered,
          level,
          depth: 0,
          text: parseText(line.replace(/^\d+\. /, '')),
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

interface Group {
  lineGroups: Line[][];
  maxDepth: number;
  maxHeadingDepth: number;
  maxChecklistDepth: number;
  maxOrderedDepth: number;
}

function parseGroup(lines: Line[]): Group {
  const maxHeadingDepth = Math.max(
    0,
    ...lines.filter((v) => v.type === TableItemType.Heading).map((line) => line.level),
  );
  const maxChecklistDepth = Math.max(
    0,
    ...lines.filter((v) => v.type === TableItemType.Checklist).map((line) => line.level),
  );
  const maxOrderedDepth = Math.max(
    0,
    ...lines.filter((v) => v.type === TableItemType.Ordered).map((line) => line.level),
  );
  const maxDepth = maxHeadingDepth + maxChecklistDepth + maxOrderedDepth;

  const lineGroups: Line[][] = [];
  let currentLineGroup: Line[] = [];
  let prevDepth = 0;
  for (const line of lines) {
    const depth =
      line.type === TableItemType.Heading
        ? line.level
        : line.type === TableItemType.Checklist
          ? maxHeadingDepth + line.level
          : maxHeadingDepth + maxChecklistDepth + line.level;
    if (depth <= prevDepth) {
      lineGroups.push(currentLineGroup);
      currentLineGroup = [];
    }
    prevDepth = depth;
    currentLineGroup.push({ ...line, depth });
  }
  if (currentLineGroup.length > 0) {
    lineGroups.push(currentLineGroup);
  }

  return { lineGroups, maxDepth, maxHeadingDepth, maxChecklistDepth, maxOrderedDepth };
}

export function parseMarkdown(text: string, options: ParserOptions = {}): TableData {
  const lines = parseLines(text);
  const group = parseGroup(lines);

  const createRow = (): TableRow => {
    return {
      type: TableItemType.Heading,
      columns: times(group.maxDepth).map((i) => ({
        type: TableItemType.Heading,
        level: 0,
        depth: 0,
        text: '',
        heading: '',
        trailing: '',
      })),
    };
  };

  const rows: TableRow[] = group.lineGroups.map((lineGroup) => {
    const row = createRow();
    for (const line of lineGroup) {
      row.columns[line.depth - 1] = {
        type: line.type,
        level: line.level,
        depth: line.depth,
        text: line.text,
        heading: line.heading,
        trailing: line.trailing,
      };
    }
    return row;
  });

  if (rows.length === 0) {
    return {
      header: [],
      separator: [],
      rows: [],
    };
  }

  const header = [
    ...repeatWithFn(group.maxHeadingDepth, (i) => {
      const heading =
        options.customHeader?.headingN?.at(i) ?? options.customHeader?.heading ?? DEFAULT_HEADER;
      return replace(heading, { level: i + 1, depth: i + 1 });
    }),
    ...repeatWithFn(group.maxChecklistDepth, (i) => {
      return replace(options.customHeader?.unorderedList ?? DEFAULT_HEADER, {
        level: i + 1,
        depth: group.maxHeadingDepth + i + 1,
      });
    }),
    ...repeatWithFn(group.maxOrderedDepth, (i) => {
      return replace(options.customHeader?.orderedList ?? DEFAULT_HEADER, {
        level: i + 1,
        depth: group.maxHeadingDepth + group.maxChecklistDepth + i + 1,
      });
    }),
  ];

  return {
    header,
    separator: repeatWithFn(group.maxDepth, () => '---'),
    rows,
  };
}

console.log(JSON.stringify(parseMarkdown('# foo\n## bar\n- [ ] a', {}), null, 2));

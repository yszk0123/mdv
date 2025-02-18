export interface Line {
  level: number;
  depth: number;
  text: string;
  heading: string;
  trailing: string;
  type: TableItemType;
}

export const TableItemType = {
  Heading: 'heading',
  Checklist: 'checklist',
  Ordered: 'ordered',
} as const;
export type TableItemType = (typeof TableItemType)[keyof typeof TableItemType];

export interface TableColumn {
  type: TableItemType;
  level: number;
  depth: number;
  text: string;
  heading: string;
  trailing: string;
}

export interface TableRow {
  type: TableItemType;
  columns: TableColumn[];
}

export interface TableData {
  header: string[];
  separator: string[];
  rows: TableRow[];
}

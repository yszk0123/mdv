export interface Line {
  depth: number;
  text: string;
  type: RowType;
}
export const RowType = {
  Text: 'text',
  Checklist: 'checklist',
  Ordered: 'ordered',
  Raw: 'raw',
} as const;
export type RowType = (typeof RowType)[keyof typeof RowType];
export interface TableColumn {
  text: string;
}
export interface TableRow {
  type: RowType;
  raws: string[];
  columns: TableColumn[];
}
export interface TableData {
  header: string[];
  separator: string[];
  rows: TableRow[];
}

export interface Line {
  depth: number;
  text: string;
  type: RowType;
}
export const RowType = {
  Text: 'text',
  Checklist: 'checklist',
  Ordered: 'ordered',
} as const;
export type RowType = (typeof RowType)[keyof typeof RowType];
interface TableColumn {
  text: string;
}
export interface TableRow {
  type: RowType;
  columns: TableColumn[];
}
export interface TableData {
  header: string[];
  separator: string[];
  rows: TableRow[];
}

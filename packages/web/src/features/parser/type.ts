export interface Line {
  depth: number;
  text: string;
  heading: string;
  trailing: string;
  type: RowType;
}
export const RowType = {
  Text: 'text',
  Checklist: 'checklist',
  Ordered: 'ordered',
} as const;
export type RowType = (typeof RowType)[keyof typeof RowType];
export interface TableColumn {
  text: string;
  heading: string;
  trailing: string;
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

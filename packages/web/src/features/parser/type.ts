export interface Line {
  level: number;
  depth: number;
  text: string;
  heading: string;
  trailing: string;
  type: RowType;
}
export const RowType = {
  // TODO: Rename "Text" to "Heading"
  Text: 'text',
  Checklist: 'checklist',
  Ordered: 'ordered',
} as const;
// TODO: Rename RowType to ColumnType and remove from Row
export type RowType = (typeof RowType)[keyof typeof RowType];
export interface TableColumn {
  type: RowType;
  level: number;
  depth: number;
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

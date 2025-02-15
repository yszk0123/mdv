import { useMemo, type JSX } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseMarkdown, stringifyMarkdown, type TableData } from "../parser";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function TableView({
  text,
  onSubmit,
}: {
  text: string;
  onSubmit: (text: string) => void;
}): JSX.Element {
  const tableData = useMemo(() => parseMarkdown(text), [text]);
  const form = useForm<TableData>({
    defaultValues: tableData,
    onSubmit: (values) => {
      onSubmit(stringifyMarkdown(values.value));
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Table>
        <TableCaption>Inline Edit (WIP)</TableCaption>
        <TableHeader>
          <TableRow>
            {tableData.header.map((item, i) => (
              <TableHead key={`${i}-${item}`}>{item}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.rows.map((row, i) => (
            <TableRow key={`${i}-${row.type}`}>
              {row.columns.map((column, j) => (
                <TableCell key={`${j}-${column.text}`}>
                  <form.Field
                    name={`rows[${i}].columns[${j}].text`}
                    mode="array"
                  >
                    {(field) => (
                      <Textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    )}
                  </form.Field>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button type="submit">変更を Markdown に反映</Button>
    </form>
  );
}

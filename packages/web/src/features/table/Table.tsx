import { type JSX, useCallback, useMemo } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@tanstack/react-form';
import { type TableData, parseMarkdown, stringifyMarkdown } from '../parser';

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
      values.formApi.reset(values.value);
      onSubmit(stringifyMarkdown(values.value));
    },
  });
  const handleBlur = useCallback(() => {
    if (form.state.isDirty) {
      form.reset(form.state.values);
      onSubmit(stringifyMarkdown(form.state.values));
    }
  }, [form, onSubmit]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Table>
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
                  <form.Field name={`rows[${i}].columns[${j}].text`} mode="array">
                    {(field) => (
                      <Textarea
                        value={field.state.value}
                        onBlur={handleBlur}
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
    </form>
  );
}

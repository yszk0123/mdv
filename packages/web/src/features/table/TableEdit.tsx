import { type JSX, useCallback, useEffect, useMemo, useState } from 'react';

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
import type { Configuration } from '@mdv/core';

interface Pos {
  row: number;
  column: number;
}

export function TableEdit({
  config,
  text,
  onSubmit,
}: {
  config: Configuration;
  text: string;
  onSubmit: (text: string) => void;
}): JSX.Element {
  const tableData = useMemo(() => parseMarkdown(text, config.parserOptions), [text, config]);
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

  const [pos, setPos] = useState<Pos | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setPos(null);
  }, [tableData]);

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
                <TableCell
                  className="text-foreground hover:bg-foreground/10"
                  key={`${j}-${column.text}`}
                  onClick={() => setPos({ row: i, column: j })}
                >
                  {pos?.row === i && pos?.column === j ? (
                    <form.Field name={`rows[${i}].columns[${j}].text`} mode="array">
                      {(field) => (
                        <Textarea
                          autoFocus
                          value={field.state.value}
                          onBlur={handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      )}
                    </form.Field>
                  ) : (
                    <pre>{column.text}</pre>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </form>
  );
}

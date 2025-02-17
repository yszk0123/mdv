import { stripCommonIndent } from '@/features/parser';
import { TableEdit } from '@/features/table/TableEdit';
import { type JSX, useCallback, useState } from 'react';
import type { ZodType } from 'zod';
import { EditButton } from './components/EditButton';
import { MarkdownEdit } from './components/MarkdownEdit';
import { TextEdit } from './components/TextEdit';
import { ViewButton } from './components/ViewButton';
import { Mode } from './type';

function useLocalStorageState<T>({
  key,
  initialValue,
  schema,
}: { key: string; initialValue: T; schema: ZodType<T> }): [T, (value: string) => void] {
  const [state, setState] = useState<T>(() => {
    const res = schema.safeParse(window.localStorage.getItem(key));
    const item = res.success ? res.data : initialValue;
    return item ? item : initialValue;
  });

  const setItem = useCallback(
    (value: string) => {
      const parsed = schema.parse(value);
      window.localStorage.setItem(key, value);
      setState(parsed);
    },
    [key, schema],
  );

  return [state, setItem];
}

const INITIAL_TEXT = stripCommonIndent(`
  # 大項目
  ## 中項目
  ### 小項目1
  - [ ] 説明\\n説明
  - [ ] 説明\\n説明
  ### 小項目2
  - [ ] 説明\\n説明
  `);

const LOCAL_STORAGE_KEYS = {
  Mode: 'mdv_mode',
} as const satisfies Record<string, `mdv_${string}`>;

export function Web(): JSX.Element {
  const [mode, setMode] = useLocalStorageState({
    key: LOCAL_STORAGE_KEYS.Mode,
    initialValue: Mode.enum.Edit,
    schema: Mode,
  });
  const [text, setText] = useState(INITIAL_TEXT);

  return (
    <div className="flex flex-col">
      <div className="m-4">
        <TextEdit text={text} onChange={setText} />
      </div>
      <div className="flex flex-col gap-4 m-4">
        <div className="self-end">
          {
            {
              [Mode.enum.View]: <EditButton onClick={() => setMode(Mode.enum.Edit)} />,
              [Mode.enum.Edit]: <ViewButton onClick={() => setMode(Mode.enum.View)} />,
            }[mode]
          }
        </div>
        {
          {
            [Mode.enum.View]: <MarkdownEdit text={text} />,
            [Mode.enum.Edit]: <TableEdit text={text} onSubmit={setText} />,
          }[mode]
        }
      </div>
    </div>
  );
}

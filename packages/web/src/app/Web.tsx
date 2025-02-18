import { stripCommonIndent } from '@/features/parser';
import { TableEdit } from '@/features/table/TableEdit';
import { type JSX, useState } from 'react';
import { TextEdit } from './components/TextEdit';

const INITIAL_TEXT = stripCommonIndent(`
  # 大項目
  ## 中項目
  ### 小項目1
  - [ ] 説明\\n説明
  - [ ] 説明\\n説明
  ### 小項目2
  - [ ] 説明\\n説明
  `);

export function Web(): JSX.Element {
  const [text, setText] = useState(INITIAL_TEXT);

  return (
    <div className="flex flex-col">
      <div className="m-4">
        <TextEdit text={text} onChange={setText} />
      </div>
      <div className="flex flex-col gap-4 m-4">
        <div className="flex text-muted-foreground text-sm">Click cell to edit</div>
        <TableEdit config={DEFAULT_CONFIGURATION} text={text} onSubmit={setText} />
      </div>
    </div>
  );
}

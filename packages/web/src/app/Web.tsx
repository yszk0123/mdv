import { TableEdit } from '@/features/table/TableEdit';
import { useState, type JSX } from 'react';
import { Mode } from './type';
import { stripCommonIndent } from '@/features/parser';
import { TextEdit } from './components/TextEdit';
import { EditButton } from './components/EditButton';
import { MarkdownEdit } from './components/MarkdownEdit';
import { ViewButton } from './components/ViewButton';

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
  const [mode, setMode] = useState<Mode>(Mode.View);
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
              [Mode.View]: <EditButton onClick={() => setMode(Mode.Edit)} />,
              [Mode.Edit]: <ViewButton onClick={() => setMode(Mode.View)} />,
            }[mode]
          }
        </div>
        {
          {
            [Mode.View]: <MarkdownEdit text={text} />,
            [Mode.Edit]: <TableEdit text={text} onSubmit={setText} />,
          }[mode]
        }
      </div>
    </div>
  );
}

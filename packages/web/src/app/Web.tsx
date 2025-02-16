import { TableEdit } from '@/features/table/TableEdit';
import type { JSX } from 'react';
import { Textarea } from '../components/ui/textarea';
import { Markdown } from '../features/markdown';
import { Button } from '@/components/ui/button';
import { EditIcon, EyeIcon } from 'lucide-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Mode } from './type';
import { textAtom, tableTextAtom, modeAtom } from './state';

function TextEditView(): JSX.Element {
  const [text, setText] = useAtom(textAtom);

  return <Textarea value={text} onChange={(e) => setText(e.currentTarget.value)} />;
}

function MarkdownView(): JSX.Element {
  const tableText = useAtomValue(tableTextAtom);

  return <Markdown text={tableText} />;
}

function TableEditView(): JSX.Element {
  const [text, setText] = useAtom(textAtom);

  return <TableEdit text={text} onSubmit={setText} />;
}

function ViewButton(): JSX.Element {
  const setMode = useSetAtom(modeAtom);

  return (
    <Button onClick={() => setMode(Mode.View)}>
      <EyeIcon />
      View
    </Button>
  );
}

function EditButton(): JSX.Element {
  const setMode = useSetAtom(modeAtom);

  return (
    <Button onClick={() => setMode(Mode.Edit)}>
      <EditIcon />
      Edit
    </Button>
  );
}

export function Web(): JSX.Element {
  const mode = useAtomValue(modeAtom);

  return (
    <div className="flex flex-col">
      <div className="m-4">
        <TextEditView />
      </div>
      <div className="flex flex-col gap-4 m-4">
        <div className="self-end">
          {
            {
              [Mode.View]: <EditButton />,
              [Mode.Edit]: <ViewButton />,
            }[mode]
          }
        </div>
        {
          {
            [Mode.View]: <MarkdownView />,
            [Mode.Edit]: <TableEditView />,
          }[mode]
        }
      </div>
    </div>
  );
}

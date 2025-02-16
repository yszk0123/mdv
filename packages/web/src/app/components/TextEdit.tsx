import type { JSX } from 'react';
import { Textarea } from '../../components/ui/textarea';

export function TextEdit({
  text,
  onChange,
}: { text: string; onChange: (text: string) => void }): JSX.Element {
  return <Textarea value={text} onChange={(e) => onChange(e.currentTarget.value)} />;
}

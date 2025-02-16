import { Button } from '@/components/ui/button';
import { EditIcon } from 'lucide-react';
import type { JSX } from 'react';

export function EditButton({ onClick }: { onClick: () => void }): JSX.Element {
  return (
    <Button onClick={onClick}>
      <EditIcon />
      Edit
    </Button>
  );
}

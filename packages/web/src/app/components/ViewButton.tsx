import type { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';

export function ViewButton({ onClick }: { onClick: () => void }): JSX.Element {
  return (
    <Button onClick={onClick}>
      <EyeIcon />
      View
    </Button>
  );
}

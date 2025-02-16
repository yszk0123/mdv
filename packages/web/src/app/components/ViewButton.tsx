import { Button } from '@/components/ui/button';
import { EyeIcon } from 'lucide-react';
import type { JSX } from 'react';

export function ViewButton({ onClick }: { onClick: () => void }): JSX.Element {
  return (
    <Button onClick={onClick}>
      <EyeIcon />
      View
    </Button>
  );
}

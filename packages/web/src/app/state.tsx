import { stripCommonIndent, transformMarkdownToTable } from '@/features/parser';
import { atom } from 'jotai';
import { Mode } from './type';

const INITIAL_TEXT = stripCommonIndent(`
# 大項目
## 中項目
### 小項目1
- [ ] 説明\\n説明
- [ ] 説明\\n説明
### 小項目2
- [ ] 説明\\n説明
`);
export const textAtom = atom(INITIAL_TEXT);

export const tableTextAtom = atom((get) => transformMarkdownToTable(get(textAtom)));

export const modeAtom = atom<Mode>(Mode.View);

import { useState, type JSX } from "react";
import { Markdown } from "../features/markdown";
import { Textarea } from "../components/ui/textarea";
import { transformMarkdownToTable } from "../features/parser";
import { TableView } from "@/features/table/Table";

const INITIAL_TEXT = `
# 大項目
## 中項目
### 小項目1
- [ ] 説明\\n説明
- [ ] 説明\\n説明
### 小項目2
- [ ] 説明\\n説明
`;

export function Web(): JSX.Element {
  const [text, setText] = useState(INITIAL_TEXT);

  return (
    <div className="flex flex-col gap-4">
      <div className="m-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
      </div>
      <div className="m-4">
        <Markdown text={transformMarkdownToTable(text)} />
      </div>
      <div className="m-4">
        <TableView text={text} onSubmit={setText} />
      </div>
    </div>
  );
}

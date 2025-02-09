import "./Markdown.css";
import { Children, type JSX } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ text }: { text: string }): JSX.Element {
  return (
    <ReactMarkdown
      className="markdown"
      remarkPlugins={[remarkGfm]}
      components={{
        td: ({ children }) => (
          <td>{Children.map(children, (v) => (v === "<br/>" ? <br /> : v))}</td>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

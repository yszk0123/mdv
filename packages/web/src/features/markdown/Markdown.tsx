import "./Markdown.css";
import { Children, type JSX } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function replaceBr(v: React.ReactNode): React.ReactNode {
  return typeof v === "string" && /<br\s*\/?>/.test(v) ? <br /> : v;
}

export function Markdown({ text }: { text: string }): JSX.Element {
  return (
    <ReactMarkdown
      className="markdown"
      remarkPlugins={[remarkGfm]}
      components={{
        td: ({ children }) => <td>{Children.map(children, replaceBr)}</td>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}

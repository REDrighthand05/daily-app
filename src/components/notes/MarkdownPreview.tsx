import { useEffect, useRef, useState } from "react";
import { renderMarkdown } from "../../bridge/ipc";

interface Props {
  content: string;
}

export default function MarkdownPreview({ content }: Props) {
  const [html, setHtml] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    renderMarkdown(content).then((h) => {
      if (!cancelled) setHtml(h);
    }).catch(() => {
      if (!cancelled) setHtml("<p><em>Preview unavailable</em></p>");
    });
    return () => { cancelled = true; };
  }, [content]);

  useEffect(() => {
    if (html && ref.current) {
      import("highlight.js/lib/core").then((hljs) => {
        ref.current?.querySelectorAll("pre code").forEach((block) => {
          try { hljs.default.highlightElement(block as HTMLElement); } catch {}
        });
      });
    }
  }, [html]);

  return (
    <div
      ref={ref}
      className="markdown-preview"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
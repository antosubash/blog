import ReactMarkdown from "react-markdown";
import { vsDark, dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { FunctionComponent } from "react";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import html from "remark-html";
import remarkToc from "remark-toc";
import "katex/dist/katex.min.css"; 
interface IProps {
  content: string;
}

const Markdown: FunctionComponent<IProps> = ({ content }) => {
  const components: any = {
    code({ node, inline, className, children, ...props } : any) {
      const match = /language-(\w+)/.exec(className || "");

      return !inline && match ? (
        <SyntaxHighlighter
          style={dracula}
          language={match[1]}
          children={String(children).replace(/\n$/, "")}
          {...props}
        />
      ) : (
        <code className={className ? className : ""} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={components}
        children={content}
        remarkPlugins={[html, remarkToc, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
      />
    </div>
  );
};

export default Markdown;

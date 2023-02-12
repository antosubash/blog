import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
const ExternalLink = ({ href, children }: any) => {
  const siteUrl = "";
  const isRoot = href[0] === "/";
  const isInternalLink = href.startsWith(siteUrl) || isRoot;

  if (isInternalLink) {
    return <a href={href}>{children}</a>;
  }

  return (
    <a
      className="bg-blue-800"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

const CodeBlock = ({ className, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || "");
  return match ? (
    <code className={className} {...props} />
  ) : (
    <code className={className} {...props} />
  );
};

const MDXComponents = {
  a: ExternalLink,
  code: CodeBlock,
};

export default MDXComponents;

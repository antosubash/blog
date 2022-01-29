/* eslint-disable react/no-children-prop */
import ReactMarkdown from "react-markdown";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import React, { FunctionComponent, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import "katex/dist/katex.min.css";
interface IProps {
  content: string;
}

const Markdown: FunctionComponent<IProps> = ({ content }) => {
  const components: any = {
    code({ node, inline, className, children, ...props }: any) {
      const [isCopied, setIsCopied] = useState(false);
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="relative">
          <div className="absolute right-0">
            <CopyToClipboard onCopy={() => setIsCopied(true)} text={children}>
              <button type="button" aria-label="Copy to Clipboard Button">
                {isCopied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 p-2 bg-gray-200 dark:bg-gray-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 p-2 bg-gray-200 dark:bg-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                )}
              </button>
            </CopyToClipboard>
          </div>
          <div className="container">
            <SyntaxHighlighter
              style={dracula}
              showLineNumbers={true}
              language={match[1]}
              children={String(children).replace(/\n$/, "")}
              {...props}
            />
          </div>
        </div>
      ) : (
        <code className={className ? className : ""} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="pt-8">
      <ReactMarkdown
        className="prose max-w-full"
        components={components}
        children={content}
      />
    </div>
  );
};

export default Markdown;

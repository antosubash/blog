import React from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import Code from './code';
interface MdxMarkdownProps {
  mdxSource: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, string>
  >;
}
const MdxMarkdown = ({ mdxSource } : MdxMarkdownProps ) => {
    var components = {
        code: (props: any) => <Code {...props}/>,
        
    };
  return (
    <div>
      <div className="prose max-w-full text-gray-900 dark:text-gray-50 prose-headings:text-gray-900 dark:prose-headings:text-gray-50 prose-blockquote:text-teal-600 text-xl">
        <MDXRemote {...mdxSource} components={components} />
      </div>
    </div>
  );
};

export default MdxMarkdown;
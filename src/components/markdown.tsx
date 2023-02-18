import React, { FunctionComponent } from "react";
import * as runtime from "react/jsx-runtime";
import { runSync } from "@mdx-js/mdx";
import MDXComponents from "./MDXComponents";
import "@code-hike/mdx/dist/index.css";
import "highlight.js/styles/night-owl.css";
interface IProps {
  content: string;
}

type MdxComponent = React.ExoticComponent<{
  components: Record<string, any>;
}>;

const Markdown: FunctionComponent<IProps> = ({ content }) => {
  const { default: MdxModuleComponent } = runSync(content, runtime) as {
    default: MdxComponent;
  };
  return (
    <div className="pt-8 prose max-w-full text-gray-900 dark:text-gray-50 prose-headings:text-gray-900 dark:prose-headings:text-gray-50 prose-code:bg-transparent prose-blockquote:text-teal-600 text-xl">
      <MdxModuleComponent components={MDXComponents} />
    </div>
  );
};

export default Markdown;

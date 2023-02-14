import { Code } from "./code";
import { Pre } from "./pre";

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



const MDXComponents = {
  a: ExternalLink,
  code: Code,
  pre: Pre
};

export default MDXComponents;

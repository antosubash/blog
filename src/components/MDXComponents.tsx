const ExternalLink = ({ href, children }: any) => {
  const siteUrl = "";
  const isRoot = href[0] === "/";
  const isInternalLink = href.startsWith(siteUrl) || isRoot;

  if (isInternalLink) {
    return <a href={href}>{children}</a>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};



const MDXComponents = {
  a: ExternalLink,
};

export default MDXComponents;

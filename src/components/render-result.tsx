import { KBarResults, useMatches } from "kbar";
import React from "react";
import ResultItem from "./result-item";

type Props = {
    style?: React.CSSProperties;
};

const RenderResults = (props: Props) => {
  const { results } = useMatches();
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem action={item} active={active} />
        )
      }
    />
  );
};

export default RenderResults;

const groupNameStyle = {
  padding: '8px 16px',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  background: 'rgba(0, 0, 0, 0.7)',
} as React.CSSProperties;
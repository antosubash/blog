import React from "react";

type Props = {
  action: any;
  active: any;
};

const ResultItem = ({ action, active }: Props) => {
  return (
    <div style={getResultStyle(active)}>
      <div style={actionStyle}>
        {action.icon && action.icon}
        <div style={actionRowStyle}>
          <span>{action.name}</span>
        </div>
      </div>
      {action.shortcut?.length ? (
        <div aria-hidden style={shortcutStyle}>
          {action.shortcut.map((shortcut: any) => (
            <kbd key={shortcut} style={kbdStyle}>
              {shortcut}
            </kbd>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ResultItem;

const kbdStyle = {
  padding: '4px 8px',
  textTransform: 'uppercase',
  color: 'var(--secondaryColor)',
  background: 'rgba(255, 255, 255, 0.1)',
} as React.CSSProperties;

const shortcutStyle = {
  display: 'grid',
  gridAutoFlow: 'column',
  gap: '4px',
} as React.CSSProperties;

const actionStyle = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
} as React.CSSProperties;

const actionRowStyle = {
  display: 'flex',
  flexDirection: 'column',
} as React.CSSProperties;

const getResultStyle = (active: any) => {
  return {
    padding: '12px 16px',
    background: active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 0,
    cursor: 'pointer',
    color: active ? '#ffffff' : '#ffffff',
  } as React.CSSProperties;
} 
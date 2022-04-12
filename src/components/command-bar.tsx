import { useRouter } from "next/router";
import React from "react";
import {
  KBarAnimator,
  KBarProvider,
  KBarPortal,
  useMatches,
  KBarPositioner,
  KBarSearch,
  KBarResults,
} from "kbar";
import RenderResults from "./render-result";
type Props = {
  children: React.ReactNode;
};

const CommandBar = (props: Props) => {
  const router = useRouter();

  const actions = [
    {
      id: "email",
      name: "Send Email",
      shortcut: ["e"],
      keywords: "send-email",
      section: "General",
      perform: () => window.open("mailto:antosubash@live.com", "_blank"),
      icon: <i className="ri-mail-line" style={iconStyle}/>,
    },
    {
      id: "source",
      name: "View Source",
      shortcut: ["s"],
      keywords: "view-source",
      section: "General",
      perform: () =>
        window.open("https://github.com/antosubash/blog", "_blank"),
      icon: <i className="ri-braces-line" style={iconStyle}/>,
    },
    {
      id: "home",
      name: "Home",
      shortcut: ["g", "h"],
      keywords: "go-home",
      section: "Go To",
      perform: () => router.push("/"),
      icon: <i className="ri-home-5-line" style={iconStyle}/>,
    },
    {
      id: "articles",
      name: "Articles",
      shortcut: ["g", "a"],
      keywords: "go-articles",
      section: "Go To",
      perform: () => router.push("/page"),
      icon: <i className="ri-article-line" style={iconStyle}/>,
    },
    {
      id: "tags",
      name: "Tags",
      shortcut: ["g", "t"],
      keywords: "go-tags",
      section: "Go To",
      perform: () => router.push("/tags"),
      icon: <i className="ri-hashtag" style={iconStyle}/>,
    },
    {
      id: "github",
      name: "Github",
      shortcut: ["g"],
      keywords: "go-github",
      section: "Follow",
      perform: () => window.open("https://github.com/antosubash", "_blank"),
      icon: <i className="ri-github-line" style={iconStyle}/>,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      shortcut: ["l"],
      keywords: "go-linkedin",
      section: "Follow",
      perform: () =>
        window.open("https://linkedin.com/in/antosubash", "_blank"),
      icon: <i className="ri-linkedin-line" style={iconStyle}/>,
    },
    {
      id: "twitter",
      name: "Twitter",
      shortcut: ["t"],
      keywords: "go-twitter",
      section: "Follow",
      perform: () =>
        window.open("https://twitter.com/antosubash", "_blank"),
      icon: <i className="ri-twitter-line" style={iconStyle}/>,
    },
  ];
  return (
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner style={positionerStyle}>
          <KBarAnimator className="kbar-blur" style={animatorStyle}>
            <KBarSearch style={searchStyle} placeholder="Type a command or search…" />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {props.children}
    </KBarProvider>
  );
};

export default CommandBar;

const positionerStyle = {
  position: 'fixed',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: '100%',
  inset: '0px',
  padding: '14vh 16px 16px',
  background: 'rgba(0, 0, 0, .8)',
  boxSizing: 'border-box',
} as React.CSSProperties;

const animatorStyle = {
  maxWidth: '600px',
  width: '100%',
  color: '#fff',
  borderRadius: '8px',
  overflow: 'hidden',
} as React.CSSProperties;

const searchStyle = {
  padding: '12px 16px',
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
  border: 'none',
  margin: 0,
  background: 'rgba(0, 0, 0)',
  color: '#ffff',
} as React.CSSProperties;

const iconStyle = {
  fontSize: '20px',
  position: 'relative',
  top: '-2px',
} as React.CSSProperties;

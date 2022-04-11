import { useKBar } from "kbar";
import React, { useEffect, useState } from "react";

type Props = {};

const ShortcutHome = (props: Props) => {
  const { query } = useKBar();
  const [mounted, setMounted] = useState(false);
  console.log(query);
  useEffect(() => {
    if (!query) return;
    setMounted(true);
  }, []);
  if (mounted) {
    const isMac = /(Mac)/i.test(navigator.userAgent);
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

    if (isMobile) {
      return <button onClick={query.toggle}>Tap to start →</button>;
    } else if (isMac) {
      return (
        <button onClick={query.toggle}>
          <span className="text-lg">Press</span>{" "}
          <span className="p-1 text-lg text-gray-900 bg-gray-300 rounded-md">
            ⌘
          </span>{" "}
          <span className="text-lg">+ </span>
          <span className="p-1 text-lg text-gray-900 bg-gray-300 rounded-md">
            K
          </span>{" "}
          <span className="text-lg">to start →</span>
        </button>
      );
    } else {
      return (
        <button className="rounded-md flex justify-center items-center" onClick={query.toggle}>
          <i className="ri-command-line px-1"></i> + <span className="font-bold px-1">K</span>
        </button>
      );
    }
  }
  return <div />;
};

export default ShortcutHome;

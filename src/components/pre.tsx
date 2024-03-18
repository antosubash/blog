"use client"
import type { ComponentProps, ReactElement } from "react";
import { useCallback, useRef } from "react";
import { CopyToClipboard } from "./copy-to-clipboard";
import { Button } from "./button";
import { WordWrapIcon } from "icons/word-wrap";

export const Pre = ({
  children,
  className = "",
  filename,
  ...props
}: ComponentProps<"pre"> & {
  filename?: string;
}): ReactElement => {
  console.log("src\\components\\pre.tsx:32:5")
  const preRef = useRef<HTMLPreElement | null>(null);

  const toggleWordWrap = useCallback(() => {
    const htmlDataset = document.documentElement.dataset;
    const hasWordWrap = "nextraWordWrap" in htmlDataset;
    if (hasWordWrap) {
      delete htmlDataset.nextraWordWrap;
    } else {
      htmlDataset.nextraWordWrap = "";
    }
  }, []);

  return (
    <div className="relative mt-6 first:mt-0">
      {filename && (
        <div className="absolute top-0 z-[1] w-full truncate rounded-t-xl bg-primary-700/5 py-2 px-4 text-xs text-gray-700 dark:bg-primary-300/10 dark:text-gray-200">
          {filename}
        </div>
      )}
      <pre
        className={[
          "bg-gray-400 mb-4 overflow-x-auto rounded-xl font-medium subpixel-antialiased dark:bg-primary-300/10 text-[.9em]",
          "contrast-more:border contrast-more:border-primary-900/20 contrast-more:contrast-150 contrast-more:dark:border-primary-100/40",
          filename ? "pt-12 pb-4" : "py-4",
          className,
        ].join(" ")}
        ref={preRef}
        {...props}
      >
        {children}
      </pre>
      <div
        className={[
          "opacity-0 transition [div:hover>&]:opacity-100 focus-within:opacity-100",
          "flex gap-1 absolute m-[11px] right-0",
          filename ? "top-8" : "top-0",
        ].join(" ")}
      >
        <Button
          onClick={toggleWordWrap}
          className="md:hidden"
          title="Toggle word wrap"
        >
          <WordWrapIcon className="pointer-events-none h-4 w-4" />
        </Button>
        <CopyToClipboard
          getValue={() =>
            preRef.current?.querySelector("code")?.textContent || ""
          }
        />
      </div>
    </div>
  );
};

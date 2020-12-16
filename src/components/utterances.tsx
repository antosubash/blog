import React from "react";

interface Props {}

export const Utterances = (props: Props) => {
  return (
    <div>
      <section
        ref={(elem) => {
          if (!elem) {
            return;
          }
          var old = document.querySelector(".utterances")

          if(old) {
              old.remove();
          }
          const scriptElem = document.createElement("script");
          scriptElem.src = "https://utteranc.es/client.js";
          scriptElem.async = true;
          scriptElem.crossOrigin = "anonymous";
          scriptElem.setAttribute("repo", "antosubash/blog");
          scriptElem.setAttribute("issue-term", "pathname");
          scriptElem.setAttribute("label", "blog-comment");
          scriptElem.setAttribute("theme", "github-light");
          elem.appendChild(scriptElem);
        }}
      />
    </div>
  );
};

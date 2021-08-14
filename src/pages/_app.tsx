import { AppProps } from "next/app";
import "../styles/index.css";
import "../node_modules/highlight.js/styles/dark.css";
import { ThemeProvider } from "next-themes";
import LayoutWrapper from "../components/layout-wrapper";
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  );
}

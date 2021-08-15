import { AppProps } from "next/app";
import "../styles/index.css";
import "../node_modules/highlight.js/styles/dark.css";
import { ThemeProvider } from "next-themes";
import LayoutWrapper from "../components/layout-wrapper";
import { AnimateSharedLayout, motion } from "framer-motion";
export default function MyApp({ Component, pageProps, router }: AppProps) {
  const spring = {
    type: "spring",
    damping: 20,
    stiffness: 100,
    when: "afterChildren",
  };
  return (
    <ThemeProvider attribute="class">
      <LayoutWrapper>
        <AnimateSharedLayout>
          <motion.div
            transition={spring}
            key={router.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="page-transition-container"
          >
            <Component {...pageProps} key={router.pathname} />
          </motion.div>
        </AnimateSharedLayout>
      </LayoutWrapper>
    </ThemeProvider>
  );
}

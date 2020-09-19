import { AppProps } from 'next/app'
import '../styles/index.css'
import "../node_modules/highlight.js/styles/dark.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

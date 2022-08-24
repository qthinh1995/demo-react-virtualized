import '../styles/globals.css'
import "react-virtualized/styles.css";
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp

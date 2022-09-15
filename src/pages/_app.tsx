import '../styles/globals.css'
import "react-virtualized/styles.css";
import type { AppProps } from 'next/app'
import { useReducer } from "react";
import Head from "next/head";
import { wrapper } from "../store/store";



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>{" "}
      <Component {...pageProps} />
    </>
  );
}

export default wrapper.withRedux(MyApp);
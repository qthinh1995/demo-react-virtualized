import '../styles/globals.css'
import "react-virtualized/styles.css";
import type { AppProps } from 'next/app'
import { useReducer } from "react";
import Head from "next/head";


const pageListPostInitialState = {
  listPost: [],
  loading: false,
  currentPage: 1,
};

function reducer(state, action) {
  switch (action.type) {
    case "loadNextPageSuccess":
      return {
        listPost: [...state.listPost, action.data],
        currentPage: state.currentPage + 1,
      };
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const [state, dispatch] = useReducer(reducer, pageListPostInitialState);

  

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

export default MyApp

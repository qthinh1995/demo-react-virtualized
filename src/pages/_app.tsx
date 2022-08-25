import '../styles/globals.css'
import "react-virtualized/styles.css";
import type { AppProps } from 'next/app'
import { useReducer } from "react";

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

  return <Component {...pageProps} />;
}

export default MyApp

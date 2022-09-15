import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import router, { useRouter } from "next/router";
import { CellMeasurer, CellMeasurerCache } from "react-virtualized";

import { fetchPosts } from "../APIServices/post";
import FilterBar, { formatQUery } from "../components/FilterBar";
import HeaderBar from "../components/HeaderBar";
import Link from "../components/Link";
import ListVirtualized from "../components/ListVirtualized";
import PostItem from "../components/PostItem";
import { groupArr, roughSizeOfObject } from "../utils";

import LoadMore from "../components/LoadMore";
import Spinner from "../components/Spinner";
import useStateMemorize from "../hooks/useStateMemorize";
import {
  selectPageState,
  setPageState,
  setPageFieldState,
} from "../store/pageSlice";
import { useDispatch, useSelector } from "react-redux";
const cache = new CellMeasurerCache();

//should be in ome global state like redux or react context


const pageSize = 500;
const column = 3;



const defaultState = {
  loading: false,
  listPost: [],
  currentPage: 1,
  isInit: true,
  scrollTop: 0
};

const Home: NextPage = ({ query, path }: any) => {
  const { asPath, pathname } = useRouter();
  const pageState = useSelector(selectPageState(asPath)) || defaultState;
  console.log('pageState: ', pageState);
  const dispatch = useDispatch();

  const pageUpdateState = (objectInput) => {
    for (const key in objectInput) {
      dispatch(
        setPageFieldState({
          data: objectInput[key],
          key: asPath,
          fieldName: key+"",
        })
      );
    }

  };
  const formattedQuery = formatQUery(query);
  const rowCount = pageState.listPost.length;

  useEffect(() => {
    if (!pageState.isInit) return;
    dispatch(setPageState({ data: defaultState, key: asPath })); //init first time

    pageUpdateState({ loading: true, isInit: false });
    fetchPosts({
      pageSize,
      page: pageState.currentPage,
      ...formattedQuery,
    }).then((posts) => {
      const newPage = pageState.currentPage + 1;
      pageUpdateState({
        currentPage: newPage,
        listPost: posts,
        loading: false,
      });
    });
  }, [formattedQuery]);
  const listPostGrouped = useMemo(
    () => groupArr(pageState.listPost, column),
    [pageState.listPost]
  );

  const rowRender = ({ index, isScrolling, key, style, parent }) => {
    const row = listPostGrouped[index];
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div style={style}>
          <div style={{ display: "flex" }}>
            {row.map((post, index) => {
              return (
                <div key={index} style={{ width: `${100 / column}%` }}>
                  <Link href={`/post/${post.id}`}>
                    <PostItem {...post} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </CellMeasurer>
    );
  };

  const onScroll = ({
    scrollTop,
    ...other
  }: {
    clientHeight: number;
    scrollHeight: number;
    scrollTop: number;
    }) => {
    pageUpdateState({scrollTop})
  };

  return (
    <div style={{ width: 1200, maxWidth: "100vw", margin: "auto" }}>
      <HeaderBar />
      <FilterBar query={query} />
      {/* <>Body</> */}
      <div>
        <h2>
          VirtualizeList: Total {rowCount} items, roundSize of the data:{" "}
          {useMemo(
            () => Math.round(roughSizeOfObject(pageState.listPost)),
            [pageState.listPost]
          )}
          Kb
        </h2>
        <div style={{ height: "70vh" }}>
          <ListVirtualized
            key={ asPath}
            data={listPostGrouped}
            rowRender={rowRender}
            onScroll={onScroll}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
            scrollTop={pageState.scrollTop}
          />
        </div>
        {pageState.loading ? (
          <Spinner />
        ) : (
          <LoadMore
            onClick={() => {
              pageUpdateState({ loading: true });
              fetchPosts({ pageSize, page: pageState.currentPage })
                .then((newPosts) => {
                  const newListPost = [...pageState.listPost, ...newPosts];

                  pageUpdateState({
                    listPost: newListPost,
                    currentPage: pageState.currentPage + 1,
                  });
                })
                .finally(() => {
                  pageUpdateState({ loading: false });
                });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Home;

export async function getServerSideProps(context) {
  return {
    props: { query: context.query }, // will be passed to the page component as props
  };
}

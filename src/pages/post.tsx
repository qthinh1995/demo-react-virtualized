import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { CellMeasurer, CellMeasurerCache } from "react-virtualized";

import { fetchPosts } from "../APIServices/post";
import FilterBar, { formatQUery } from "../components/FilterBar";
import HeaderBar from "../components/HeaderBar";
import Link from "../components/Link";
import ListVirtualized from "../components/ListVirtualized";
import PostItem from "../components/PostItem";
import { groupArr, roughSizeOfObject } from "../utils";

import { useDispatch, useSelector } from "react-redux";
import { List, WindowScroller } from "react-virtualized";
import LoadMore from "../components/LoadMore";
import Spinner from "../components/Spinner";
import {
  selectPageState,
  setPageFieldState,
  setPageState,
} from "../store/pageSlice";
const cache = new CellMeasurerCache();

//should be in ome global state like redux or react context

const pageSize = 500;
const column = 3;

const defaultState = {
  loading: false,
  listPost: [],
  currentPage: 1,
  isInit: true,
  scrollTop: 0,
};

const Home: NextPage = ({ query, path }: any) => {
  const { asPath, pathname } = useRouter();
  const pageState = useSelector(selectPageState(asPath)) || defaultState;
  const dispatch = useDispatch();

  const pageUpdateState = (objectInput) => {
    for (const key in objectInput) {
      dispatch(
        setPageFieldState({
          data: objectInput[key],
          key: asPath,
          fieldName: key + "",
        })
      );
    }
  };
  const formattedQuery = formatQUery(query);
  const rowCount = pageState.listPost.length;
 

  useEffect(() => {
    const onScroll = () => {
      pageUpdateState({ scrollTop: window.scrollY });
    }; 
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (typeof scroll === "function") {
      console.log("scoll", pageState.scrollTop);
      scroll(0,pageState.scrollTop)
    }
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

  const rowRender = ({ index, key, style, parent }) => {
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


  const dataSize = useMemo(
    () => Math.round(roughSizeOfObject(pageState.listPost)),
    [pageState.listPost]
  )

  return (
    <WindowScroller>
      {({ height, isScrolling, registerChild, scrollTop }) => (
        <div style={{ width: 1200, maxWidth: "100vw", margin: "auto" }}>
          <HeaderBar />
          <FilterBar query={query} />
          {/* <>Body</> */}
          <div>
            <h2>
              VirtualizeList: Total {rowCount} items, roundSize of the data:{" "}
              {dataSize}
              Kb
            </h2>
            <div ref={registerChild}>
              <ListVirtualized
                autoHeight
                height={height}
                isScrolling={isScrolling}
                key={asPath}
                data={listPostGrouped}
                rowRenderer={rowRender}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
                // scrollTop={pageState.scrollTop}
                scrollTop={scrollTop}
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
      )}
    </WindowScroller>
  );
};

export default Home;

export async function getServerSideProps(context) {
  return {
    props: { query: context.query }, // will be passed to the page component as props
  };
}

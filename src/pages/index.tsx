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
const cache = new CellMeasurerCache();

//should be in ome global state like redux or react context
let rememberScrollTop;
let rememberListPost = [];
let rememberCurrentPage = 1;

const pageSize = 500;
const column = 3;

const onScroll = ({
  scrollTop,
  ...other
}: {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
}) => {
  rememberScrollTop = scrollTop; //the scrollTop position should be saved in the variable (shouldn't be the state, cause we don't need to rerender on this)
};

const Home: NextPage = ({ query, path }: any) => {
  const { asPath, pathname } = useRouter();
  const [pageState, setPageState] = useStateMemorize(
    {
      loading: false,
      listPost: [],
      currentPage: 1,
    },
    asPath
  );

  const pageUpdateState = (value) => {
    console.log("value: ", value);
    setPageState({ ...pageState, ...value });
  };
  const formattedQuery = formatQUery(query);
  const rowCount = pageState.listPost.length;

  useEffect(() => {
    pageUpdateState({ loading: true });
    fetchPosts({ pageSize, page: pageState.currentPage, ...formattedQuery })
      .then((posts) => {
        const newPage = pageState.currentPage + 1;
        pageUpdateState({
          currentPage: newPage,
          listPost: posts,
          loading: false,
        });
      })
      .finally(() => {
        // pageUpdateState({ loading: false });
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
            data={listPostGrouped}
            rowRender={rowRender}
            onScroll={onScroll}
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
            scrollTop={rememberScrollTop}
          />
        </div>
        {pageState.loading ? (
          <Spinner />
        ) : // <LoadMore
        //   onClick={() => {
        //     setLoading(true);
        //     fetchPosts({ pageSize, page: pageState.currentPage })
        //       .then((newPosts) => {
        //         const newListPost = [...pageState.listPost, ...newPosts];
        //         rememberListPost = newListPost;

        //         setListPost(newListPost);

        //         const newPage = pageState.currentPage + 1;
        //         rememberCurrentPage = newPage;
        //         setCurrentPage(newPage);
        //       })
        //       .finally(() => {
        //         setLoading(false);
        //       });
        //   }}
        // />
        null}
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

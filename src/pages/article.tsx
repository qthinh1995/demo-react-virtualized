import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { CellMeasurer, CellMeasurerCache } from "react-virtualized";

import { fetchPosts } from "../APIServices/post";
import FilterBar from "../components/FilterBar";
import HeaderBar from "../components/HeaderBar";
import Link from "../components/Link";
import ListVirtualized from "../components/ListVirtualized";
import PostItem from "../components/PostItem";
import { groupArr, roughSizeOfObject } from "../utils";

import LoadMore from "../components/LoadMore";
import Spinner from "../components/Spinner";
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

const Home: NextPage = ({ query }: any) => {
  const [listPost, setListPost] = useState(rememberListPost);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(rememberCurrentPage);
  const rowCount = listPost.length;

  useEffect(() => {
    if (listPost.length > 0) return; // should only fetch data when posts is empty
    setLoading(true);
    fetchPosts({ pageSize, page: currentPage })
      .then((posts) => {
        rememberListPost = posts;
        setListPost(posts);

        const newPage = currentPage + 1;
        rememberCurrentPage = newPage;
        setCurrentPage(newPage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const listPostGrouped = useMemo(() => groupArr(listPost, column), [listPost]);

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
          {useMemo(() => Math.round(roughSizeOfObject(listPost)), [listPost])}Kb
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
        {loading ? (
          <Spinner />
        ) : (
          <LoadMore
            onClick={() => {
              setLoading(true);
              fetchPosts({ pageSize, page: currentPage })
                .then((newPosts) => {
                  const newListPost = [...listPost, ...newPosts];
                  rememberListPost = newListPost;

                  setListPost(newListPost);

                  const newPage = currentPage + 1;
                  rememberCurrentPage = newPage;
                  setCurrentPage(newPage);
                })
                .finally(() => {
                  setLoading(false);
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

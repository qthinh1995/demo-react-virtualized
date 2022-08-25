import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";

import { fetchPosts } from "../APIServices/post";
import PostItem from "./PostItem";
import LoadMore from "./LoadMore";
import Spinner from "./Spinner";

const cache = new CellMeasurerCache();

//should be in redux or some global state
let rememberScrollTop;
let rememberListPost = [];
let rememberCurrentPage = 1;

const onScroll = ({
  scrollTop,
  ...other
}: {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
}) => {
  console.log("scrollTop: ", scrollTop);
  rememberScrollTop = scrollTop; //the scrollTop position should be saved in the variable (shouldn't be the state, cause we don't need to rerender on this)
};

const ListVirtualized = () => {
  const [listPost, setListPost] = useState(rememberListPost);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(rememberCurrentPage);
  const rowCount = listPost.length;

  useEffect(() => {
    if (listPost.length > 0) return; // should only fetch data when posts is empty
    setLoading(true);
    fetchPosts({ pageSize: 20, page: currentPage })
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

  const rowRender = ({ index, isScrolling, key, style, parent }) => {
    const currentPost = listPost[index];
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div style={style}>
          {currentPost ? (
            <Link href={`/post/${currentPost.id}`}>
              <a>
                <PostItem {...currentPost} />
              </a>
            </Link>
          ) : loading ? (
            <Spinner />
          ) : (
            <LoadMore
              onClick={() => {
                setLoading(true);
                fetchPosts({ pageSize: 20, page: currentPage })
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
      </CellMeasurer>
    );
  };

  return (
    <div style={{ height: "90vh", width: 900, margin: "auto" }}>
      <h2> VirtualizeList</h2>

      <AutoSizer>
        {({ height, width }) => (
          <MyCustomList
            height={height}
            width={width}
            rowCount={rowCount + 1} // add 1 more row to render the "LoadMore" button
            deferredMeasurementCache={cache}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRender}
            onScroll={onScroll}
            rememberScrollTop={rememberScrollTop}
          />
        )}
      </AutoSizer>
    </div>
  );
};

const MyCustomList = ({ rememberScrollTop, ...props }) => {
  const listRef = useRef();
  const [scrollTop, setScrollTop] = useState(rememberScrollTop);

  useEffect(() => {
    setScrollTop(undefined);
  }, []);
  return <List ref={listRef} {...props} scrollTop={scrollTop} />; //scrollTop should be set at the beginning then change to undefined to allow freely scrolling
};

export default ListVirtualized;

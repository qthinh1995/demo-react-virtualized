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

//should be in ome global state like redux or react context
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
  rememberScrollTop = scrollTop; //the scrollTop position should be saved in the variable (shouldn't be the state, cause we don't need to rerender on this)
};
function roughSizeOfObject(object) {
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === "boolean") {
      bytes += 4;
    } else if (typeof value === "string") {
      bytes += value.length * 2;
    } else if (typeof value === "number") {
      bytes += 8;
    } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes * 0.001;
}

const pageSize = 500;
const column = 3;
const ListVirtualized = () => {
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

  const rowRender = ({ index, isScrolling, key, style, parent }) => {
    const rowIndex = index * column;
    const startPosition = listPost[rowIndex];
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <div style={style}>
          {startPosition ? (
            <div style={{ display: "flex" }}>
              {[...new Array(column)].map((_, index) => {
                const currentPost = listPost[rowIndex + index];
                if (!currentPost) return null;
                return (
                  <div key={index} style={{ width: `${100 / column}%` }}>
                    <Link href={`/post/${currentPost.id}`}>
                      <a>
                        <PostItem {...currentPost} />
                      </a>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : loading ? (
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
      </CellMeasurer>
    );
  };

  return (
    <div
      style={{ height: "90vh", width: 1200, maxWidth: "100vw", margin: "auto" }}
    >
      <h2>
        VirtualizeList: Total {rowCount} items, roundSize of the data:{" "}
        {Math.round(roughSizeOfObject(listPost))}Kb
      </h2>

      <AutoSizer>
        {({ width, height }) => (
          <MyCustomList
            height={height}
            width={width}
            rowCount={Math.ceil(rowCount / column) + 1} // add 1 more row to render the "LoadMore" button
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

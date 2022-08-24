import { useEffect, useRef } from "react";
import Link from "next/link";
import { List, AutoSizer } from "react-virtualized";

import listPost from "../constant/listPost";

let rememberScrollTop;

const onScroll = ({
  scrollTop,
}: {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
}) => {
  rememberScrollTop = scrollTop;
};

const rowRender = ({ index, isScrolling, key, style }) => {
  const currentPost = listPost[index];
  return (
    <div key={key} style={style}>
      <Link href={`/post/${currentPost.id}`}>
        <a>
          <h3>{currentPost.title}</h3>
          <div>{currentPost.description}</div>
        </a>
      </Link>
    </div>
  );
};

const ListVirtualized = () => {
  const didMountRef = useRef(false);
  useEffect(() => {
    didMountRef.current = true;
  }, []);
  return (
    <div style={{ height: "40vh" }}>
      <h2> VirtualizeList</h2>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            // overscanRowCount={overscanRowCount}
            // noRowsRenderer={this._noRowsRenderer}
            rowCount={listPost.length}
            rowHeight={100}
            rowRenderer={rowRender}
            onScroll={onScroll}
            // scrollTop={didMountRef.current ? undefined : rememberScrollTop}
            scrollTop={didMountRef.current ? undefined : rememberScrollTop}

            // scrollToIndex={scrollToIndex}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default ListVirtualized;

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { List, AutoSizer } from "react-virtualized";

import listPost from "../constant/listPost";

let rememberScrollTop;

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
  return (
    <div style={{ height: "40vh" }}>
      <h2> VirtualizeList</h2>
      <AutoSizer>
        {({ height, width }) => (
          <MyCustomList
            height={height}
            width={width}
            rowCount={listPost.length}
            rowHeight={100}
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
    if (rememberScrollTop !== undefined) {
      setScrollTop(undefined);
      // listRef.current?.scrollToPosition?.(rememberScrollTop);
    }
  }, []);
  return <List ref={listRef} {...props} scrollTop={scrollTop} />; //scrollTop should be set at the beginning then change to undefined to allow freely scrolling
};;

export default ListVirtualized;

import { useEffect, useState } from "react";
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
            scrollTop={rememberScrollTop}
          />
        )}
      </AutoSizer>
    </div>
  );
};

const MyCustomList = ({ scrollTop, ...props }) => {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);
  return <List {...props} scrollTop={didMount ? undefined : scrollTop} />; //scrollTop should be set at the beginning then change to undefined to allow freely scrolling
};

export default ListVirtualized;

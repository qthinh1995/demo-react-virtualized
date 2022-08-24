import Link from "next/link";
import { List, AutoSizer } from "react-virtualized";

import listPost from "../constant/listPost";

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
          <List
            height={height}
            width={width}
            // overscanRowCount={overscanRowCount}
            // noRowsRenderer={this._noRowsRenderer}
            rowCount={listPost.length}
            rowHeight={100}
            rowRenderer={rowRender}
            // scrollToIndex={scrollToIndex}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default ListVirtualized;

import { useEffect, useState, useRef } from "react";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
} from "react-virtualized";

import { fetchPosts } from "../APIServices/post";
import PostItem from "./PostItem";
import LoadMore from "./LoadMore";
import Spinner from "./Spinner";
import Link from "./Link";

//should be in ome global state like redux or react context
let rememberScrollTop;

const pageSize = 500;
const column = 3;
const ListVirtualized = ({
  data = [],
  ...props
}: {
  data: any[];
  onScroll: () => void;
  rowHeight: any;
} & any) => {
  return (
    <List rowCount={data.length} width={1200}  {...props} />
  );

  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <List
          autoHeight
          height={height}
          isScrolling={isScrolling}
          onScroll={onChildScroll}
          // rowCount={...}
          // rowHeight={...}
          // rowRenderer={...}
          // scrollTop={scrollTop}
          // width={...}
        />
      )}
    </WindowScroller>
  );
  return (
    <WindowScroller>
      {({ height, isScrolling, onScroll, scrollTop }) => (
        <MyCustomList
          autoHeight
          height={height}
          // width={width}
          rowCount={data.length}
          rowRenderer={rowRender}
          onScroll={onScroll}
          deferredMeasurementCache={deferredMeasurementCache}
          scrollTop={scrollTop}
          {...props}
        />
      )}
    </WindowScroller>
  );
};

const MyCustomList = ({ scrollTop: scrollTopProp, ...props }) => {
  const listRef = useRef();
  const [scrollTop, setScrollTop] = useState(scrollTopProp);

  useEffect(() => {
    setScrollTop(undefined);
  }, []);
  return <List ref={listRef} {...props} scrollTop={scrollTop} />; //scrollTop should be set at the beginning then change to undefined to allow freely scrolling
};

export default ListVirtualized;

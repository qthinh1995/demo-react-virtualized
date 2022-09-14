import { useEffect, useState, useRef } from "react";
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
import Link from "./Link";

//should be in ome global state like redux or react context
let rememberScrollTop;

const pageSize = 500;
const column = 3;
const ListVirtualized = ({
  data = [],
  rowRender = () => null,
  onScroll,
  ...props
}: {
  data: any[];
  rowRender: () => React.ReactNode;
  onScroll: () => void;
  deferredMeasurementCache: any;
  rowHeight: any;
} & any) => {
  console.log("props: ", props);
  useEffect(() => {
    console.log("update");
    return () => console.log("unmount");
  }, []);
  return (
    <AutoSizer>
      {({ width, height }) => (
        <MyCustomList
          height={height}
          width={width}
          rowCount={data.length}
          rowRenderer={rowRender}
          onScroll={onScroll}
          {...props}
        />
      )}
    </AutoSizer>
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

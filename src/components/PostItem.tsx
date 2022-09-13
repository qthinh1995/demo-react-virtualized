import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";

import { fetchPosts } from "../APIServices/post";

const PostItem = ({ title, thumbnail, description }) => {
  return (
    <div className="post-item" style={{}}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img style={{ width: 50, height: 50 }} src={thumbnail} />
      </div>
      <div style={{ padding: 10, minWidth: 0 }}>
        <h3 style={{ marginTop: 0 }} className="post-title">
          {title}
        </h3>
        <div className="post-description">{description}</div>
      </div>
    </div>
  );
};

export default PostItem;

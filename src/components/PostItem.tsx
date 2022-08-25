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
    <div
      style={{
        display: "flex",
        margin: 10,
        boxShadow: "1px 1px 4px rgba(0,0,0,0.4)",
        borderRadius: "4px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img style={{ width: 150, height: 150 }} src={thumbnail} />
      </div>
      <div style={{ padding: 10 }}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <div>{description}</div>
      </div>
    </div>
  );
};

export default PostItem;

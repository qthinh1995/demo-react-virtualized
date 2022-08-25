import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Link from "next/link";

import listPost from "../../constant/listPost";
import { fetchPost } from "../../APIServices/post";

const PostDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const rowCount = post.length;

  useEffect(() => {
    setLoading(true);
    fetchPost(id)
      .then((post) => {
        setPost(post);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      <div>{post.detail}</div>
      <h3
        onClick={() => router.back()}
        style={{
          textDecoration: "underline",
          color: "blue",
          cursor: "pointer",
        }}
      >
        Click here to go back
      </h3>
    </div>
  );
};

export default PostDetail;

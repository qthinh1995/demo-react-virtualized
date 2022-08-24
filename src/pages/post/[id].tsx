import { useRouter } from "next/router";
import type { NextPage } from "next";
import listPost from "../../constant/listPost";

const PostDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const currentPost = listPost.find(
    (post) => post.id.toString() === id?.toString()
  );
  if (!currentPost) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{currentPost.title}</h1>
      <p>{currentPost.description}</p>
      <div>{currentPost.detail}</div>
    </div>
  );
};

export default PostDetail;

import IPostType from "../../../types/types";

interface PostListProps {
  post: IPostType;
}

const PostList = ({ post }: PostListProps) => {
  return (
    <>
      <div>{post?.text}</div>
      <button>Del</button>
      <button>Edit</button>
    </>
  );
};

export default PostList;

import { dbService } from "../../../fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import IPostType from "../../../types/types";
import { useState } from "react";

interface PostListProps {
  post: IPostType;
  isOwner: boolean;
}

const PostList = ({ post, isOwner }: PostListProps) => {
  const [editing, setEditing] = useState(false); // editing 모드인지 여부
  const [newPost, setNewPost] = useState(post.text); // input의 값
  const PostTextRef = doc(dbService, "posts", `${post.id}`);

  const onDeleteClick = async () => {
    const ok = window.confirm("정말 이 게시물을 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(PostTextRef);
    }
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPost(e.currentTarget.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateDoc(PostTextRef, {
      text: newPost,
    });
    setEditing(false);
  };

  return (
    <>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your post"
              value={newPost}
              onChange={onChange}
              required
            />
            <input type="submit" value="Update Post" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <div>{post?.text}</div>
          {/* 글 작성자에게만 삭제, 수정 버튼이 보이도록 함 */}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Del</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default PostList;

import { dbService, storageService } from "../../fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { IPostType } from "../../types/types";
import { useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { styled } from "styled-components";

interface PostListProps {
  post: IPostType;
  isOwner: boolean;
}

const PostList = ({ post, isOwner }: PostListProps) => {
  const [editing, setEditing] = useState(false); // editing 모드인지 여부
  const [newPost, setNewPost] = useState(post.title); // input의 값
  const postTextRef = doc(dbService, "posts", `${post.id}`); // 파일을 가리키는 참조 생성
  const postUrlRef = ref(storageService, post.attachmentUrl); // 파일을 가리키는 참조 생성

  // 게시물 삭제
  const onDeleteClick = async () => {
    const ok = window.confirm("정말 이 게시물을 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(postTextRef);
      // 삭제하려는 게시물에 이미지 파일이 있는 경우 이미지 파일 스토리지에서 삭제
      if (post.attachmentUrl) {
        await deleteObject(postUrlRef);
      }
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
    await updateDoc(postTextRef, {
      text: newPost,
    });
    setEditing(false);
  };

  return (
    <Container>
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
          <div>{post?.title}</div>
          {post.attachmentUrl && (
            <img
              src={post.attachmentUrl}
              width="200px"
              height="200px"
              alt="image"
            />
          )}

          {/* 글 작성자에게만 삭제, 수정 버튼이 보이도록 함 */}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Del</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default PostList;

const Container = styled.div`
  display: inline-block;
  padding: 0 3rem;
`;

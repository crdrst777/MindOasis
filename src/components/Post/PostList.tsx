import { styled } from "styled-components";
import { useCallback, useState } from "react";
import IPostType from "../../types/types";
import Modal from "../UI/Modal";

interface PostListProps {
  post: IPostType;
  isOwner: boolean;
}

const PostList = ({ post, isOwner }: PostListProps) => {
  const [openModal, setOpenModal] = useState(false);

  const handleModal = useCallback(() => {
    setOpenModal((prev: boolean) => !prev);
  }, [setOpenModal]);

  return (
    <Container>
      <SinglePost onClick={handleModal}>
        {openModal && <Modal handleModal={handleModal}></Modal>}
        {post.attachmentUrl && (
          <PreviewImg src={post.attachmentUrl} alt="image" />
        )}
        <div>{post?.text}</div>
      </SinglePost>
    </Container>
  );
};

export default PostList;

const Container = styled.div`
  display: inline-block;
  margin: 1.3rem;
  /* width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center; */
`;

const SinglePost = styled.div``;

const PreviewImg = styled.img`
  width: 17rem;
  height: 17rem;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 3px 0px;
`;

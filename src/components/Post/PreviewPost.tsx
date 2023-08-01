import React from "react";
import { styled } from "styled-components";
import { PostType } from "../../types/types";
import { useNavigate } from "react-router-dom";

interface PreviewPostProps {
  post: PostType;
  // openModal: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const PreviewPost = ({ post }: PreviewPostProps) => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.

  const openModal = (id: any) => {
    navigate(`/content/detail/${id}`); // 이 url로 바꿔줌.
  };

  return (
    <Container onClick={() => openModal(post.id)}>
      <Overlay>
        <Title>{post?.title}</Title>
      </Overlay>
      {/* {post.attachmentUrl && ( */}
      <PreviewImg src={post.attachmentUrl} alt="image" />
      {/* )} */}
    </Container>
  );
};

export default PreviewPost;

const Container = styled.div`
  /* display: inline-block; */
  /* margin: 1.3rem; */
  width: 17rem;
  height: 17rem;
  cursor: pointer;
`;

const Overlay = styled.div`
  opacity: 0;
  width: 17rem;
  height: 17rem;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.154);
  /* z-index: 2000; */
  transition: opacity 0.2s ease;
  border-radius: 4px;

  &:hover {
    opacity: 1;
    box-shadow: inset 0 2px 45px rgba(0, 0, 0, 0.218);
  }
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  /* box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 3px 0px; */
  object-fit: cover;
  border-radius: 4px;
`;

const Title = styled.div`
  display: inline-block;
  width: 11rem;
  height: 2.7rem;
  overflow: hidden;
  color: ${(props) => props.theme.colors.white};
  margin-top: 11.5rem;
  margin-left: 2rem;
  font-size: 1.02rem;
  line-height: 1.3rem;
`;

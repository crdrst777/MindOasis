import { styled } from "styled-components";
import { PostType, UserDocType } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { ReactComponent as HeartIcon } from "../../assets/icon/heart-icon.svg";
import { useEffect, useState } from "react";

interface Props {
  post: PostType;
  userData: UserDocType;
  likestate: boolean;
}

const PreviewPost = ({ post, userData, likestate }: Props) => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const openModal = (id: any) => {
    navigate(`/content/${id}`); // 이 url로 바꿔줌.
  };

  useEffect(() => {
    if (userData === null) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Container onClick={() => openModal(post.id)}>
      <Overlay>
        {isLoggedIn && (
          <LikeBtn $likestate={likestate}>
            <HeartIcon />
          </LikeBtn>
        )}
        <Title $isLoggedIn={isLoggedIn}>{post?.title}</Title>
      </Overlay>
      <PreviewImg src={post.attachmentUrl} alt="image"></PreviewImg>
    </Container>
  );
};

export default PreviewPost;

const Container = styled.div`
  width: 15.3rem;
  height: 15.3rem;
  cursor: pointer;
`;

const Overlay = styled.div`
  opacity: 1;
  width: 15.3rem;
  height: 15.3rem;
  position: absolute;
  background-color: rgba(68, 68, 68, 0.351);
  /* z-index: 2000; */
  transition: opacity 0.2s ease;
  border-radius: 0.8rem;

  &:hover {
    opacity: 0;
    /* box-shadow: inset 0 2px 45px rgba(0, 0, 0, 0.383); */
  }
`;

const LikeBtn = styled.div<{ $likestate: boolean }>`
  float: right;
  margin: 0.8rem 0.8rem 0 0;

  svg {
    width: 1.82rem;
    height: 1.82rem;
    padding: 0.45rem;
    fill: ${(props) =>
      props.$likestate ? "#ffdd00" : props.theme.colors.white};
  }
`;

const Title = styled.div<{ $isLoggedIn: boolean }>`
  display: inline-block;
  width: 11rem;
  height: 2.55rem;
  overflow: hidden;
  color: ${(props) => props.theme.colors.white};
  margin-top: ${(props) => (props.$isLoggedIn ? "8.35rem" : "11rem")};
  margin-left: 1.9rem;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.2rem;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.8rem;
`;

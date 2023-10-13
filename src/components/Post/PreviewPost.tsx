import { styled } from "styled-components";
import { PostType, UserDocType } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { ReactComponent as HeartIcon } from "../../assets/icon/heart-icon.svg";
import { useEffect, useState } from "react";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

interface Props {
  post: PostType;
  userData: UserDocType;
}

const PreviewPost = ({ post, userData }: Props) => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

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

  useEffect(() => {
    if (userData?.myLikes?.length > 0) {
      // for (let i = 1; i < userData.myLikes.length; i++) {
      //   if (userData.myLikes[i] === post.id) {
      //     setIsLiked(true);
      //     console.log("true");
      //   } else {
      //     setIsLiked(false);
      //     console.log("false");
      //   }
      // }

      for (let i of userData.myLikes) {
        if (i === post.id) {
          setIsLiked(true);
          // console.log("true");
        } else {
          // setIsLiked(false);
          // console.log("false");
        }
      }
    }
  }, [userData]);
  // 좋아요를 클릭할때마다 리덕스로 올려준 값을 content 컴포넌트에서 받아서 userData를 다시 가져와준다.
  // 이 다시 가져온 바뀐 값을 조회해서 isLiked 상태값에 따라 하트 색을 바꿔준다.
  // 현재 else일땐 아무 처리도 안하기 때문에 리랜더링이 안되는게 맞다. (setIsLiked(false); 하면 오류가 남)

  return (
    <Container onClick={() => openModal(post.id)}>
      <Overlay>
        {isLoggedIn && (
          <LikeBtn $likestate={isLiked}>
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

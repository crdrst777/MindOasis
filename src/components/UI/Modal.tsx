import { styled } from "styled-components";
import close from "../../assets/img/close-icon.png";
import { useMatch, useNavigate } from "react-router-dom";
import { PostType, UserDocType } from "../../types/types";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import ModalHeader from "./ModalHeader";
import ReadMap from "../Map/ReadMap";
import PostKeyword from "../Post/PostKeyword";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface Props {
  userData: UserDocType;
  postId?: string;
}

const Modal = ({ userData, postId }: Props) => {
  const [post, setPost] = useState<PostType>({});
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  // const modalMatch = useMatch(`/content/detail/:id`);
  // useMatch는 이 route 안에 있는지 다른 곳에 있는지 알려줌. -->  string | null
  const closeModal = () => navigate(-1);
  const { isLiked } = useSelector((state: RootState) => state.isLiked);
  const createdAt = post.createdAt;
  const timestamp = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(createdAt);

  const getPost = async () => {
    try {
      const postDocRef = doc(dbService, "posts", `${postId}`);
      const postDocSnap = await getDoc(postDocRef);
      if (postDocSnap.exists()) {
        setPost(postDocSnap.data());
      } else {
        console.log("Document does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPost();

    // Modal 배경 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLiked]);

  // console.log("modalMatch", modalMatch);
  console.log("post", post);

  return (
    <>
      <Container>
        <Overlay onClick={closeModal} />

        <ModalContainer>
          {/* <CloseIcon onClick={closeModal} /> */}
          <Main>
            <ModalHeader post={post} postId={postId} userData={userData} />
            <ImgContainer>
              <Img src={post.attachmentUrl} alt="image" />
            </ImgContainer>
            <ContentsContainer>
              <ContentInfo>
                <Title>{post.title}</Title>
                <CreatedAt>{timestamp}</CreatedAt>
              </ContentInfo>
              <Text>{post.text}</Text>
              <KeywordContainer>
                <PostKeyword placeKeyword={post.placeKeyword} />
              </KeywordContainer>
            </ContentsContainer>
            <ReadMap placeInfo={post.placeInfo} />
          </Main>
        </ModalContainer>
      </Container>
    </>
  );
};

export default Modal;

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 98;
`;

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(16, 16, 16, 0.39);
  z-index: 99;
  backdrop-filter: blur(2px);
  animation: modal-bg-show 0.5s;
  @keyframes modal-bg-show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  /* position: absolute; */
  position: fixed;
  width: 52rem;
  top: 2.3rem;
  margin: auto 0;
  border-radius: 0.2rem;
  background-color: white;
  height: 50rem;
  overflow: scroll;
  z-index: 100;

  /* animation: modal-show 0.6s; */
  /* 
  @media (max-width: 1120px) {
    width: 50rem;
  }
  @media (max-width: 50rem) {
    width: 80%;
  } */

  /* @keyframes modal-show {
    from {
      opacity: 0;
      margin-top: -50px;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  } */
`;

// const CloseIcon = styled.img.attrs({
//   src: close,
// })`
//   position: absolute;
//   width: 1rem;
//   right: 1.5rem;
//   top: 1.5rem;
//   cursor: pointer;
// `;

const Main = styled.article`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  width: 100%;
`;

const ImgContainer = styled.section`
  padding: 0rem 2rem;
  height: 32rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  height: 100%;
  max-width: 47.5rem;
  object-fit: cover;
`;

const ContentsContainer = styled.section`
  padding: 1.25rem 4rem;
`;

const ContentInfo = styled.div`
  padding: 0.9rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  display: inline-block;
  max-width: 32.5rem;
  overflow: hidden;
  color: ${(props) => props.theme.colors.moreDarkGray};
  font-size: 1.3rem;
  font-weight: 500;
  line-height: 1.7rem;
`;

const CreatedAt = styled.div`
  color: ${(props) => props.theme.colors.gray};
  font-size: 0.9rem;
`;

const Text = styled.div`
  display: inline-block;
  min-height: 4rem;
  max-height: 15.5rem;
  overflow: hidden;
  padding: 0.6rem 0;
  font-size: 1.1rem;
  line-height: 1.6rem;
`;

const KeywordContainer = styled.div``;

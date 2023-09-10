import { styled } from "styled-components";
import close from "../../assets/img/close-icon.png";
import { useNavigate } from "react-router-dom";
import { PostType, UserDocType } from "../../types/types";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import ModalHeader from "./ModalHeader";
import ReadMap from "../Map/ReadMap";
import PostKeyword from "../Post/PostKeyword";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import CommentSection from "../Comment/CommentSection";

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
  const timestamp = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(post.createdAt);

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
                <RegisteredDate>{timestamp}</RegisteredDate>
              </ContentInfo>
              <Text>{post.text}</Text>
              <PostKeyword placeKeyword={post.placeKeyword} />
            </ContentsContainer>
            <ReadMapWrapper>
              <ReadMap placeInfo={post.placeInfo} />
            </ReadMapWrapper>

            <CommentSection userData={userData} postId={postId} />
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
  position: fixed;
  width: 49rem;
  top: 2.1rem;
  margin: auto 0;
  border-radius: 0.2rem;
  background-color: white;
  height: 45.2rem;
  overflow: scroll;
  overflow-x: hidden;
  z-index: 100;
  /* animation: modal-show 0.6s;
  @keyframes modal-show {
    from {
      opacity: 0;
      margin-top: -50px;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  } */
  /* 
  @media (max-width: 1120px) {
    width: 50rem;
  }
  @media (max-width: 50rem) {
    width: 80%;
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
  width: 100%;
`;

const ImgContainer = styled.section`
  padding: 0rem 2rem;
  height: 28.7rem;
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
  padding: 1.2rem 3.8rem;
`;

const ContentInfo = styled.div`
  /* border-top: ${(props) => props.theme.borders.lightGray}; */
  padding: 0.25rem 0 0.4rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  display: inline-block;
  max-width: 32.5rem;
  overflow: hidden;
  color: ${(props) => props.theme.colors.moreDarkGray};
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.7rem;
`;

const RegisteredDate = styled.div`
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  color: ${(props) => props.theme.colors.gray1};
`;

const Text = styled.div`
  display: inline-block;
  min-height: 4rem;
  max-height: 16.5rem;
  overflow: hidden;
  padding: 0.5rem 0;
  font-size: 1.05rem;
  font-weight: 400;
  line-height: 1.55rem;
`;

const ReadMapWrapper = styled.section`
  padding: 0 3.8rem;
  /* box-shadow: inset 0 2px 45px rgba(0, 0, 0, 0.383); */
`;

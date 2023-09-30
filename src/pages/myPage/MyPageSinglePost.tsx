import { styled } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { PostType } from "../../types/types";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import ModalHeader from "../../components/UI/ModalHeader";
import PostKeyword from "../../components/Post/PostKeyword";
import ReadMap from "../../components/Map/ReadMap";
import { getUserData } from "../../api/user";
import CommentSection from "../../components/Comment/CommentSection";

const MyPageSinglePost = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [post, setPost] = useState<PostType>({});
  const [userData, setUserData] = useState<any>({});
  const postId = useParams().id;
  const closeModal = () => navigate(-1);
  const createdAt = post.createdAt;
  const timestamp = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(createdAt);

  useEffect(() => {
    getUserData(userInfo.uid, setUserData);
  }, []);

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
  }, []);

  return (
    <>
      <Container>
        <Overlay onClick={closeModal} />

        <ModalContainer>
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

export default MyPageSinglePost;

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
  top: 1.6rem;
  margin: auto 0;
  border-radius: 0.2rem;
  background-color: white;
  /* height: 40rem; */
  height: 93.5%;
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
  font-size: 1.01rem;
  font-weight: 400;
  line-height: 1.55rem;
`;

const ReadMapWrapper = styled.section``;

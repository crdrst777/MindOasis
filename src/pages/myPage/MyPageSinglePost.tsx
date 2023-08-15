import { styled } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { PostType } from "../../types/types";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ModalHeader from "../../components/UI/ModalHeader";
import PostKeyword from "../../components/Post/PostKeyword";
import ReadMap from "../../components/Map/ReadMap";
import { getUserData } from "../../api/user";

const MyPageSinglePost = () => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [post, setPost] = useState<PostType>({});
  const [userData, setUserData] = useState<any>({});
  const postId = useParams().id;
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

  useEffect(() => {
    getUserData(userInfo.uid, setUserData);
  }, []);

  console.log("postId", postId);

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
`;

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

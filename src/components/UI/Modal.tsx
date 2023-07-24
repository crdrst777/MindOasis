import { styled } from "styled-components";
import close from "../../assets/img/close-icon.png";
import { useMatch, useNavigate } from "react-router-dom";
import { IPostType } from "../../types/types";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";

interface ModalProps {
  postId?: string;
}

const Modal = ({ postId }: ModalProps) => {
  const [post, setPost] = useState<IPostType>({});
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  const modalMatch = useMatch(`/content/detail/:id`);
  // useMatch는 이 route 안에 있는지 다른 곳에 있는지 알려줌. -->  string | null
  const docRef = doc(dbService, "posts", `${postId}`);
  const closeModal = () => navigate(-1);

  const getPost = async () => {
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost(docSnap.data());
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Modal 배경 스크롤 막기
  useEffect(() => {
    getPost();

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  console.log("postId", postId);
  console.log("post", post);
  // console.log("modalMatch", modalMatch);

  return (
    <>
      <Container>
        <Overlay onClick={closeModal} />

        <ModalContainer>
          {/* <Header></Header> */}

          <CloseIcon onClick={closeModal} />
          <Content>
            <div>id {postId}</div>
            <div>creatorId {post.creatorId}</div>
            <div>createdAt {post.createdAt}</div>
            <div>title {post.title}</div>
            <div>text {post.text}</div>

            <div>placeName {post.placeInfo?.placeName}</div>
            <div>placeAddr {post.placeInfo?.placeAddr}</div>

            {post.attachmentUrl && (
              <PreviewImg src={post.attachmentUrl} alt="image" />
            )}
          </Content>
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

const ModalContainer = styled.article`
  /* position: absolute; */
  position: fixed;
  width: 60rem;
  top: 2.3rem;
  margin: auto 0;
  border-radius: 0.4rem;
  padding: 1.5rem;
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
// const Header = styled.header``;

const CloseIcon = styled.img.attrs({
  src: close,
})`
  position: absolute;
  width: 1rem;
  right: 1.5rem;
  top: 1.5rem;
  cursor: pointer;
`;

const Content = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 130rem;
`;

const PreviewImg = styled.img`
  width: 17rem;
  height: 17rem;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 3px 0px;
`;

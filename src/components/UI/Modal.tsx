import { styled } from "styled-components";
import close from "../../assets/img/close-icon.png";
import { useMatch, useNavigate } from "react-router-dom";
import { PostType, UserDocType } from "../../types/types";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { dbService } from "../../fbase";
import ModalHeader from "./ModalHeader";

interface ModalProps {
  postId?: string;
}

const Modal = ({ postId }: ModalProps) => {
  const [post, setPost] = useState<PostType>({});
  // const [user, setUser] = useState<any>({});
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  const modalMatch = useMatch(`/content/detail/:id`);
  // useMatch는 이 route 안에 있는지 다른 곳에 있는지 알려줌. -->  string | null
  const postDocRef = doc(dbService, "posts", `${postId}`);

  const closeModal = () => navigate(-1);

  const getPost = async () => {
    try {
      const postDocSnap = await getDoc(postDocRef);
      if (postDocSnap.exists()) {
        setPost(postDocSnap.data());
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPost();
    // getUser();

    // Modal 배경 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // console.log("post.creatorId", post.creatorId);
  // 여기서 post.creatorId를 가져올수가잇음

  // const userDocRef = doc(dbService, "users", `${post.creatorId}`); // 파일을 가리키는 참조 생성

  // const getUser = async () => {
  //   try {
  //     const userDocSnap = await getDoc(userDocRef);
  //     if (userDocSnap.exists()) {
  //       setUser(userDocSnap.data());
  //     } else {
  //       console.log("User document does not exist");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getUser();
  // }, []);

  console.log("post", post);
  console.log("postId", postId);
  // console.log("user", user);
  // console.log("modalMatch", modalMatch);

  return (
    <>
      <Container>
        <Overlay onClick={closeModal} />

        <ModalContainer>
          {/* <CloseIcon onClick={closeModal} /> */}
          <Main>
            <ModalHeader post={post} />

            <ImgContainer>
              {post.attachmentUrl && (
                <Img src={post.attachmentUrl} alt="image" />
              )}
            </ImgContainer>
            <ContentsContainer>
              <div>id {postId}</div>
              <div>creatorId {post.creatorId}</div>
              <div>createdAt {post.createdAt}</div>
              <div>title {post.title}</div>
              <div>text {post.text}</div>
              <div>placeName {post.placeInfo?.placeName}</div>
              <div>placeAddr {post.placeInfo?.placeAddr}</div>
            </ContentsContainer>
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
  width: 60rem;
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
  height: 130rem;
`;

const ImgContainer = styled.section`
  height: 32rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.6rem 1.5rem;
`;

const Img = styled.img`
  height: 100%;
  object-fit: cover;
`;

const ContentsContainer = styled.section`
  padding: 0.6rem 1.5rem;
`;

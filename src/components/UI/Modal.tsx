import { styled } from "styled-components";
import close from "../../assets/img/close-icon.png";
import { useMatch, useNavigate } from "react-router-dom";
import IPostType from "../../types/types";
import { useEffect } from "react";

interface ModalProps {
  post: IPostType;
  postId?: string;
  isOwner: boolean;
}

const Modal = ({ post, postId, isOwner }: ModalProps) => {
  const navigate = useNavigate(); // useNavigate 훅을 사용하면 url을 왔다갔다할 수 있음.
  // const modalMatch = useMatch(`/content/detail/:id`);
  // useMatch는 이 route 안에 있는지 다른 곳에 있는지 알려줌. -->  string | null

  const closeModal = () => navigate(-1);

  // Modal 배경 스크롤 막기
  // useEffect(() => {
  //   document.body.style.cssText = `
  //     position: fixed;
  //     top: -${window.scrollY}px;
  //     overflow-y: scroll;
  //     width: 100%;`;
  //   return () => {
  //     const scrollY = document.body.style.top;
  //     document.body.style.cssText = "";
  //     window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
  //   };
  // }, []);

  // Modal 배경 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  console.log("postId", postId);

  return (
    <>
      <Container>
        <Overlay onClick={closeModal} />

        <ModalContainer>
          {/* <Header></Header> */}

          <Close onClick={closeModal} />
          <Content>
            <div>{post.id}</div>
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
  background-color: rgba(43, 43, 43, 0.136);
  z-index: 99;
  /* backdrop-filter: blur(5px); */
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

  /* animation: modal-show 0.4s; */
  /* 
  @media (max-width: 1120px) {
    width: 50rem;
  }
  @media (max-width: 50rem) {
    width: 80%;
  } */

  @keyframes modal-show {
    from {
      opacity: 0;
      margin-top: -50px;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
`;
// const Header = styled.header``;

const Close = styled.img.attrs({
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

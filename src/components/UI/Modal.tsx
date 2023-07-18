import { styled } from "styled-components";
import close from "../../assets/img/close-icon.png";

interface ModalProps {
  handleModal: () => void;
}

const Modal = ({ handleModal }: ModalProps) => {
  return (
    <>
      <Container>
        <Background
        // onClick={(e: React.MouseEvent) => {
        //   e.preventDefault();npm
        //   if (handleModal) {
        //     handleModal();
        //   }
        // }}
        ></Background>
        <ModalContainer>
          {/* <Header></Header> */}

          <Close onClick={() => handleModal} />
          <Content></Content>
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
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Background = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(71, 71, 71, 0.15);
  backdrop-filter: blur(5px);
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
  position: absolute;
  width: 60rem;
  top: 5rem;
  border-radius: 10px;
  padding: 1.5rem;
  background-color: white;
  box-shadow: 0 0 30px rgba(30, 30, 30, 0.185);
  min-height: 45rem;
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
`;

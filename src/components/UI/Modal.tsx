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
import avatar from "../../assets/img/avatar-icon.png";

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

  console.log("post", post);
  console.log("userData", userData);

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
              <PostKeyword placeKeyword={post.placeKeyword} />
            </ContentsContainer>
            <ReadMapWrapper>
              <ReadMap placeInfo={post.placeInfo} />
            </ReadMapWrapper>
            <Comment>
              <CommentInput>
                <CITitle>
                  댓글
                  <span></span>
                </CITitle>
                <CIContainer>
                  <CIAvatarWrapper>
                    {userData.photoURL ? (
                      <img src={userData.photoURL} alt="profile" />
                    ) : (
                      <BasicAvatarIcon />
                    )}
                  </CIAvatarWrapper>
                  <CIText placeholder="댓글을 입력하세요." />
                </CIContainer>
                <CIBtnWrapper>
                  <CIBtn>댓글 등록</CIBtn>
                </CIBtnWrapper>
              </CommentInput>

              <CommentList></CommentList>
            </Comment>
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
  padding: 0.5rem 0;
  line-height: 1.5rem;
  font-weight: 400;
`;

const ReadMapWrapper = styled.section`
  padding: 0 3.8rem;
  /* box-shadow: inset 0 2px 45px rgba(0, 0, 0, 0.383); */
`;

const Comment = styled.section`
  height: 20rem;
  padding: 5rem 3.8rem 3.8rem 3.8rem;
  /* border-top: ${(props) => props.theme.borders.lightGray}; */
`;

const CommentInput = styled.div``;

const CITitle = styled.div`
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 1rem;

  span {
  }
`;
const CIContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CIAvatarWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  img {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const BasicAvatarIcon = styled.img.attrs({
  src: avatar,
})`
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  border-radius: 50%;
`;

const CIText = styled.textarea`
  margin-left: 1rem;
  width: 100%;
  height: 6.5rem;
  font-size: 0.95rem;
  color: ${(props) => props.theme.colors.moreDarkGray};
  /* padding: 1.1rem 1.2rem; */
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 2px solid ${(props) => props.theme.colors.borderGray};
  line-height: 1.5rem;
  word-spacing: -0.3rem;
  resize: none;
  outline: none;

  /* &:hover {
    outline: 1px solid #c9c9c9;
  }
  &:focus {
    outline: 1px solid #c9c9c9;
  } */
`;

const CIBtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;

const CIBtn = styled.button`
  color: black;
  background-color: ${(props) => props.theme.colors.lightGray};
  border-radius: 3rem;
  padding: 0.74rem 1.3rem 0.7rem 1.3rem;
  font-size: 0.95rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.lightBlack};
  font-weight: 500;
  &:hover {
    background-color: ${(props) => props.theme.colors.darkGray};
  }
`;

const CommentList = styled.ul``;

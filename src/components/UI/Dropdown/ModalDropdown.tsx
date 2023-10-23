import { styled } from "styled-components";
import { ReactComponent as EllipsisIcon } from "../../../assets/icon/ellipsis-icon.svg";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { dbService, storageService } from "../../../fbase";
import { deleteObject, ref } from "firebase/storage";
import { PostType } from "../../../types/types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPlaceInfoReducer } from "../../../store/placeInfoSlice";

interface Props {
  post: PostType;
  postId: string;
}

const ModalDropdown = ({ post, postId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const postRef = doc(dbService, "posts", `${postId}`); // 파일을 가리키는 참조 생성
  const postUrlRef = ref(storageService, post.attachmentUrl); // 파일을 가리키는 참조 생성

  const DropdownBtnClick = () => {
    setIsOpen((prev) => !prev);
  };

  const onEditClick = () => {
    dispatch(
      setPlaceInfoReducer({
        placeName: post.placeInfo.placeName,
        placeAddr: post.placeInfo.placeAddr,
      })
    );
    // EditPost.tsx로 props 전달
    navigate(`/editpost`, {
      state: {
        post: post,
        postId: postId,
      },
    });
  };

  const onDeleteClick = async () => {
    const ok = window.confirm("정말 이 게시물을 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(postRef);
      // 삭제하려는 게시물에 이미지 파일이 있는 경우 이미지 파일 스토리지에서 삭제
      if (post.attachmentUrl) {
        await deleteObject(postUrlRef);
      }
      navigate(-1);
    }
  };

  return (
    <Container>
      <DropdownBtn onClick={DropdownBtnClick} $isopen={isOpen}>
        <EllipsisIcon />
      </DropdownBtn>
      {!isOpen ? (
        <Hidden />
      ) : (
        <DropdownContainer>
          <Arrow>
            <div></div>
          </Arrow>
          <ArrowBorder>
            <div></div>
          </ArrowBorder>
          <DropdownList>
            <DropdownItem onClick={onEditClick}>수정</DropdownItem>
            <DropdownItem onClick={onDeleteClick}>삭제</DropdownItem>
          </DropdownList>
        </DropdownContainer>
      )}
    </Container>
  );
};

export default ModalDropdown;

const Container = styled.div`
  margin-left: 0.5rem;
`;

const DropdownBtn = styled.button<{ $isopen: any }>`
  width: 2.25rem;
  height: 1.8rem;
  background-color: ${(props) => props.theme.colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.9px solid #c1c1c1;
  border-radius: 3px;
  cursor: pointer;
  transition: border-color 0.15s ease;
  &:hover {
    border-color: #787878;
  }

  svg {
    width: 2.25rem;
    height: 1.8rem;
    padding: 0.45rem;
    fill: ${(props) => (props.$isopen ? "#616161" : props.theme.colors.gray)};
    transition: fill 0.15s ease;
    &:hover {
      fill: #616161;
    }
  }
`;

const Hidden = styled.div`
  max-height: 0;
  overflow: hidden;
`;

const DropdownContainer = styled.div`
  width: 8rem;
  border: 0.9px solid #c1c1c1;
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: 0 8px 16px #00000029;
  position: absolute;
  inset: auto 0px 0px auto;
  transform: translate3d(-27px, -598.5px, 0px);
`;

const Arrow = styled.div`
  position: absolute;
  left: 0px;
  transform: translate3d(99px, -95px, 0px);
  top: calc(100% - 1px);
  z-index: 1;
  pointer-events: none;

  div {
    width: 1rem;
    height: 1rem;
    border: 8px solid #0000;
    border-bottom-color: rgb(255, 255, 255);
  }
`;

const ArrowBorder = styled.div`
  position: absolute;
  left: 0px;
  transform: translate3d(99px, -96px, 0px);
  top: calc(100% - 1px);
  z-index: 0;
  pointer-events: none;

  div {
    width: 1rem;
    height: 1rem;
    border: 8px solid #0000;
    border-bottom-color: #c1c1c1;
  }
`;

const DropdownList = styled.ul`
  height: 100%;
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const DropdownItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.86rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.darkGray};
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f5f5f5;
  }
`;

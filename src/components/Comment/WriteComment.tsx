import { styled } from "styled-components";
import { CommentType, PostType, UserDocType } from "../../types/types";
import avatar from "../../assets/img/avatar-icon.png";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { dbService } from "../../fbase";

interface Props {
  userData: UserDocType;
  postId?: string;
}

const WriteComment = ({ userData, postId }: Props) => {
  const [text, setText] = useState("");

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const commentData: CommentType = {
      userId: userData.uid,
      userPhotoURL: userData.photoURL,
      userDisplayName: userData.displayName,
      createdAt: Date.now(),
      text: text,
      postId,
    };

    addDoc(collection(dbService, "comments"), commentData);
  };

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <Container>
      <Title>
        댓글
        <span></span>
      </Title>
      <InputContainer>
        <AvatarWrapper>
          {userData.photoURL ? (
            <img src={userData.photoURL} alt="profile" />
          ) : (
            <BasicAvatarIcon />
          )}
        </AvatarWrapper>
        <TextInput
          maxLength={500}
          value={text}
          onChange={onTextChange}
          placeholder="댓글을 입력하세요."
        />
      </InputContainer>
      <BtnWrapper>
        <Btn onClick={onSubmit}>댓글 등록</Btn>
      </BtnWrapper>
    </Container>
  );
};

export default WriteComment;

const Container = styled.div``;

const Title = styled.div`
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 1rem;

  span {
  }
`;
const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AvatarWrapper = styled.div`
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

const TextInput = styled.textarea`
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

const BtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 0.85rem 0;
`;

const Btn = styled.button`
  color: black;
  background-color: ${(props) => props.theme.colors.lightGray};
  border-radius: 4rem;
  padding: 0.71rem 1.3rem 0.63rem 1.3rem;
  font-size: 0.95rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.lightBlack};
  font-weight: 500;
  &:hover {
    background-color: ${(props) => props.theme.colors.darkGray};
  }
`;

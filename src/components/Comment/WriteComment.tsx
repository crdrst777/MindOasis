import { styled } from "styled-components";
import { CommentType, UserDocType } from "../../types/types";
import { ReactComponent as BasicAvatarIcon } from "../../assets/icon/avatar-icon.svg";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../../fbase";

interface Props {
  userData: UserDocType;
  postId?: string;
  submitRenderingHandler: (triggerRender: boolean) => void;
}

const WriteComment = ({ userData, postId, submitRenderingHandler }: Props) => {
  const [text, setText] = useState("");
  const [triggerRender, setTriggerRender] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const userDocRef = doc(dbService, "users", `${userData?.uid}`); // 현재 로그인한 유저를 가리키는 참조 생성

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("로그인을 해주세요.");
    } else {
      const commentData: CommentType = {
        id: `${userData.uid}-${Date.now()}`,
        userId: userData.uid,
        createdAt: Date.now(),
        text: text,
        postId,
      };

      if (text !== "") {
        // id 지정해서 comment 문서 생성.
        await setDoc(
          doc(dbService, "comments", `${userData.uid}-${Date.now()}`),
          commentData
        );

        setTriggerRender((prev) => !prev);
        setText("");
      }

      // users.commnets에 comment id 저장하기
      await updateDoc(userDocRef, {
        comments: [...userData.comments, `${userData.uid}-${Date.now()}`],
      });
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  useEffect(() => {
    if (Object.keys(userData).length === 0) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [userData, postId]);

  useEffect(() => {
    submitRenderingHandler(triggerRender);
  }, [triggerRender]);

  // console.log("sub-triggerRender", triggerRender);
  console.log("userData", userData);

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
            <BasicAvatarIconWrapper>
              <BasicAvatarIcon />
            </BasicAvatarIconWrapper>
          )}
        </AvatarWrapper>
        <TextInput
          maxLength={500}
          value={text}
          onChange={onChange}
          placeholder="댓글을 입력하세요."
        />
      </InputContainer>
      <BtnWrapper>
        <SubmitBtn onClick={onSubmit}>댓글 등록</SubmitBtn>
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

const BasicAvatarIconWrapper = styled.div`
  svg {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 50%;
  }
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

const SubmitBtn = styled.button`
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

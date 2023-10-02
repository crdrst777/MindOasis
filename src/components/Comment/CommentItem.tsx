import { styled } from "styled-components";
import { CommentType } from "../../types/types";
import { ReactComponent as BasicAvatarIcon } from "../../assets/icon/avatar-icon.svg";
import { deleteDoc, doc } from "firebase/firestore";
import { dbService } from "../../fbase";
import { useEffect, useState } from "react";
import { getUserData } from "../../api/user";

interface Props {
  comment?: CommentType;
  userId: string;
  delRenderingHandler: (triggerRender: boolean) => void;
}

const CommentItem = ({ comment, userId, delRenderingHandler }: Props) => {
  const commentRef = doc(dbService, "comments", `${comment.id}`); // 파일을 가리키는 참조 생성
  const [userData, setUserData] = useState<any>({}); // userInfo의 userId를 통해 얻은 userData
  const [triggerRender, setTriggerRender] = useState(false);

  const timestamp = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(comment.createdAt);

  useEffect(() => {
    getUserData(comment.userId, setUserData); // 리턴값 -> setUserData(userDocSnap.data());
  }, []);

  const onDeleteClick = async () => {
    const ok = window.confirm("정말 이 댓글을 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(commentRef);
      console.log("삭제함");
      setTriggerRender((prev) => !prev);
    }
  };

  useEffect(() => {
    delRenderingHandler(triggerRender);
  }, [comment, userId, triggerRender]);

  // console.log("del-triggerRender", triggerRender);

  return (
    <>
      <Container>
        {comment && (
          <>
            <CommentHeader>
              <InfoContainer>
                <AvatarWrapper>
                  {userData.photoURL ? (
                    <img src={userData.photoURL} alt="profile photo" />
                  ) : (
                    <BasicAvatarIconWrapper>
                      <BasicAvatarIcon />
                    </BasicAvatarIconWrapper>
                  )}
                </AvatarWrapper>
                <Info>
                  <Nickname>{userData.displayName}</Nickname>
                  <RegisteredDate>{timestamp}</RegisteredDate>
                </Info>
              </InfoContainer>

              {userId === comment.userId && (
                <DeleteBtn onClick={onDeleteClick}>삭제</DeleteBtn>
              )}
            </CommentHeader>

            <CommentText>
              <p>{comment.text}</p>
            </CommentText>
          </>
        )}
      </Container>
    </>
  );
};

export default CommentItem;

const Container = styled.li`
  padding: 1.3rem 0;
  border-bottom: 2px solid #e1e1e1;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.3rem;
`;

const InfoContainer = styled.div`
  display: flex;
`;

const AvatarWrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 1rem;

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

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Nickname = styled.div`
  font-weight: 600;
  margin-top: 0.1rem;
`;
const RegisteredDate = styled.div`
  font-size: 0.88rem;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: ${(props) => props.theme.colors.gray1};
  margin-top: 0.1rem;
`;

const DeleteBtn = styled.button`
  width: 2.25rem;
  height: 1.8rem;
  padding-top: 0.13rem;
  background-color: ${(props) => props.theme.colors.white};
  border: 0.9px solid #c1c1c1;
  border-radius: 3px;
  color: ${(props) => props.theme.colors.gray};
  cursor: pointer;
  transition: border-color 0.15s ease;
  &:hover {
    background-color: ${(props) => props.theme.colors.moreLightGray};
    border-color: #787878;
    color: #616161;
  }
`;

const CommentText = styled.div`
  p {
    font-size: 1.01rem;
    font-weight: 400;
    line-height: 1.55rem;
  }
`;
